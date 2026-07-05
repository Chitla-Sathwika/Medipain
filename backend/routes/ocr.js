import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import Tesseract from "tesseract.js";
import { tests, medicines } from "../data/seed.js";
import { findMentionsInText, findBestMatch } from "../utils/fuzzy.js";
import { requireAuth } from "../middleware/auth.js";
import { addUpload } from "../db.js";

const router = express.Router();

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype);
    if (!ok) return cb(new Error("Only JPG, JPEG, and PNG are supported for OCR right now."));
    cb(null, true);
  },
});

// --- Method 1: Tesseract (fast, free, works well on clean printed text) ---
async function runTesseractOCR(filePath) {
  const { data } = await Tesseract.recognize(filePath, "eng");
  return { extractedText: data.text || "", confidence: Math.round(data.confidence) };
}

// --- Method 2: Claude Vision (reads the image directly — handles messy
// printed text AND handwriting, which Tesseract fundamentally cannot do,
// since Tesseract only recognizes fonts it was trained on). Requires
// ANTHROPIC_API_KEY. This mirrors how tools like Lovable-built apps get
// "reads handwriting" to work: they send the image to a vision-capable AI
// model instead of a traditional OCR engine. ---
async function runVisionOCR(filePath, mimeType, apiKey) {
  const base64 = fs.readFileSync(filePath).toString("base64");

  const systemPrompt = `You read medical prescription images — both printed and handwritten — for a patient-education app. Read the image carefully and respond with ONLY raw JSON (no markdown fences, no preamble), matching exactly this shape:
{
  "extractedText": "your best-effort full transcription of the prescription",
  "isHandwritten": true or false,
  "confidence": a number 0-100 for how legible/certain you are,
  "possibleTests": ["array of medical test names you can identify, using standard names"],
  "possibleMedicines": ["array of medicine names you can identify, using standard/generic names"]
}
If handwriting is very messy, still give your best guess for each field and lower the confidence score accordingly. Never refuse — always return your best-effort JSON.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
            { type: "text", text: "Read this prescription image and return the JSON described in your instructions." },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude Vision API error: ${errText}`);
  }

  const data = await response.json();
  const textBlock = data.content?.find((c) => c.type === "text");
  const raw = (textBlock?.text || "{}").replace(/```json|```/g, "").trim();
  return JSON.parse(raw);
}

router.post("/upload", requireAuth, upload.single("prescription"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  const apiKey = process.env.ANTHROPIC_API_KEY;

  try {
    let extractedText = "";
    let confidence = 0;
    let ocrMethod = "tesseract";
    let isHandwritten = false;
    let aiGuessedTests = [];
    let aiGuessedMedicines = [];

    if (apiKey) {
      // Preferred path: AI vision reads the image directly, so handwriting
      // works. If this fails for any reason (rate limit, bad key), we fall
      // back to Tesseract rather than failing the whole upload.
      try {
        const vision = await runVisionOCR(req.file.path, req.file.mimetype, apiKey);
        extractedText = vision.extractedText || "";
        confidence = Math.round(vision.confidence ?? 70);
        isHandwritten = !!vision.isHandwritten;
        aiGuessedTests = vision.possibleTests || [];
        aiGuessedMedicines = vision.possibleMedicines || [];
        ocrMethod = "ai-vision";
      } catch (visionErr) {
        console.error("Vision OCR failed, falling back to Tesseract:", visionErr.message);
        const tess = await runTesseractOCR(req.file.path);
        extractedText = tess.extractedText;
        confidence = tess.confidence;
        ocrMethod = "tesseract-fallback";
      }
    } else {
      // No API key configured — Tesseract only. This handles clean printed
      // prescriptions well but will genuinely struggle with handwriting;
      // we say so honestly via lowConfidenceWarning below rather than
      // pretending to have read it.
      const tess = await runTesseractOCR(req.file.path);
      extractedText = tess.extractedText;
      confidence = tess.confidence;
    }

    // Match against our seeded database from two angles: (1) fuzzy-scan the
    // full extracted text, and (2) directly fuzzy-match each AI-guessed name
    // (catches cases where Claude names something slightly differently than
    // our alias list, e.g. "Complete Blood Count" vs "CBC").
    const textMatches = findMentionsInText(extractedText, tests);
    const textMatchesMed = findMentionsInText(extractedText, medicines);

    const guessMatchesTests = aiGuessedTests
      .map((name) => findBestMatch(name, tests, 0.55))
      .filter(Boolean)
      .map((m) => ({ item: m.item, matchedAlias: m.matchedAlias, score: m.score, method: "ai-guess" }));

    const guessMatchesMeds = aiGuessedMedicines
      .map((name) => findBestMatch(name, medicines, 0.55))
      .filter(Boolean)
      .map((m) => ({ item: m.item, matchedAlias: m.matchedAlias, score: m.score, method: "ai-guess" }));

    // Merge and dedupe by item id, keeping the highest-confidence match found.
    function mergeMatches(...lists) {
      const map = new Map();
      for (const list of lists) {
        for (const m of list) {
          const existing = map.get(m.item.id);
          if (!existing || m.score > existing.score) map.set(m.item.id, m);
        }
      }
      return Array.from(map.values());
    }

    const matchedTests = mergeMatches(textMatches, guessMatchesTests);
    const matchedMedicines = mergeMatches(textMatchesMed, guessMatchesMeds);

    await addUpload(req.userId, {
      filename: req.file.originalname,
      extractedText,
      matchedTests: matchedTests.map((m) => ({ id: m.item.id, name: m.item.name.en, confidence: Math.round(m.score * 100) })),
      matchedMedicines: matchedMedicines.map((m) => ({ id: m.item.id, name: m.item.name.en, confidence: Math.round(m.score * 100) })),
    });

    fs.unlink(req.file.path, () => {});

    res.json({
      ocrMethod,
      isHandwritten,
      extractedText,
      ocrConfidence: confidence,
      lowConfidenceWarning:
        confidence < 60
          ? ocrMethod === "tesseract"
            ? "Text quality looks low — this often means handwriting, which Tesseract can't reliably read. Add an ANTHROPIC_API_KEY to backend/.env to enable AI vision OCR, which handles handwriting much better."
            : "Confidence is low even with AI vision — the handwriting may be very unclear. Consider a clearer photo or search manually below."
          : null,
      matchedTests: matchedTests.map((m) => ({
        id: m.item.id,
        name: m.item.name.en,
        matchedAlias: m.matchedAlias,
        confidence: Math.round(m.score * 100),
        method: m.method,
      })),
      matchedMedicines: matchedMedicines.map((m) => ({
        id: m.item.id,
        name: m.item.name.en,
        matchedAlias: m.matchedAlias,
        confidence: Math.round(m.score * 100),
        method: m.method,
      })),
    });
  } catch (err) {
    fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: "OCR processing failed: " + err.message });
  }
});

export default router;
