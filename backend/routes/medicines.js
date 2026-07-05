import express from "express";
import { medicines } from "../data/seed.js";
import { findBestMatch } from "../utils/fuzzy.js";
import { requireAuth } from "../middleware/auth.js";
import { addRecentSearch } from "../db.js";

const router = express.Router();

function localize(med, lang) {
  return {
    ...med,
    name: med.name[lang] || med.name.en,
    uses: med.uses[lang] || med.uses.en,
    translatedPartial: lang !== "en",
  };
}

router.get("/", (req, res) => {
  const lang = req.query.lang || "en";
  res.json({ medicines: medicines.map((m) => localize(m, lang)) });
});

router.get("/search", (req, res) => {
  const { q, lang = "en" } = req.query;
  if (!q) return res.status(400).json({ error: "Query parameter 'q' is required." });

  const match = findBestMatch(q, medicines, 0.5);
  if (!match) {
    return res.json({ result: null, message: "No matching medicine found. Try a different name." });
  }

  res.json({
    result: localize(match.item, lang),
    matchConfidence: Math.round(match.score * 100),
    correctedFrom: match.matchedAlias !== q.toLowerCase() ? q : null,
    disclaimer: "This information is for educational purposes only. Always follow your doctor's advice.",
  });
});

router.get("/:id", (req, res) => {
  const lang = req.query.lang || "en";
  const med = medicines.find((m) => m.id === req.params.id);
  if (!med) return res.status(404).json({ error: "Medicine not found." });
  res.json({ medicine: localize(med, lang) });
});

router.post("/log-search", requireAuth, async (req, res) => {
  const { query } = req.body;
  await addRecentSearch(req.userId, query, "medicine");
  res.json({ message: "logged" });
});

export default router;
