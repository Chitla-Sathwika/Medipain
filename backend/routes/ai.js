import express from "express";
import fetch from "node-fetch";
import { tests, medicines } from "../data/seed.js";
import { findBestMatch } from "../utils/fuzzy.js";

const router = express.Router();

const LANG_NAMES = { en: "English", te: "Telugu", hi: "Hindi" };

function ruleBasedFallback(question, lang) {
  const q = question.toLowerCase();
  const allItems = [...tests, ...medicines];
  const match = findBestMatch(q, allItems, 0.3);
  if (match) {
    const item = match.item;
    const isTest = tests.includes(item);
    const name = item.name[lang] || item.name.en;
    const summary = isTest ? item.purpose[lang] || item.purpose.en : item.uses[lang] || item.uses.en;
    return `${name}: ${summary}`;
  }
  return "I couldn't confidently match that to an item in my current test/medicine database. Try naming a specific test or medicine (e.g. 'CBC' or 'Dolo 650'), or connect an ANTHROPIC_API_KEY on the backend for open-ended AI answers.";
}

router.post("/ask", async (req, res) => {
  const { question, lang = "en" } = req.body;
  if (!question) return res.status(400).json({ error: "question is required." });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.json({ answer: ruleBasedFallback(question, lang), source: "rule-based-fallback" });
  }

  try {
    const systemPrompt = `You are MediPlain's medical information assistant. Explain medical tests and medicines in simple, patient-friendly ${LANG_NAMES[lang] || "English"}. Always remind the user to follow their doctor's advice for anything about dosage or diagnosis. Keep answers under 120 words. Never give a definitive diagnosis.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system: systemPrompt,
        messages: [{ role: "user", content: question }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.json({ answer: ruleBasedFallback(question, lang), source: "rule-based-fallback", apiError: errText });
    }

    const data = await response.json();
    const textBlock = data.content?.find((c) => c.type === "text");
    res.json({ answer: textBlock?.text || ruleBasedFallback(question, lang), source: "claude" });
  } catch (err) {
    res.json({ answer: ruleBasedFallback(question, lang), source: "rule-based-fallback", error: err.message });
  }
});

export default router;
