import express from "express";
import { tests } from "../data/seed.js";
import { findBestMatch } from "../utils/fuzzy.js";
import { requireAuth } from "../middleware/auth.js";
import { addRecentSearch } from "../db.js";

const router = express.Router();

function localize(test, lang) {
  return {
    ...test,
    name: test.name[lang] || test.name.en,
    purpose: test.purpose[lang] || test.purpose.en,
    translatedPartial: lang !== "en" && !test.purpose[lang] ? false : lang !== "en",
  };
}

router.get("/", (req, res) => {
  const lang = req.query.lang || "en";
  res.json({ tests: tests.map((t) => localize(t, lang)) });
});

router.get("/search", (req, res) => {
  const { q, lang = "en" } = req.query;
  if (!q) return res.status(400).json({ error: "Query parameter 'q' is required." });

  const match = findBestMatch(q, tests, 0.5);
  const suggestions = tests
    .map((t) => ({ t, score: Math.max(...t.aliases.map((a) => a === q.toLowerCase() ? 1 : 0)) }))
    .filter((x) => x.t !== match?.item)
    .slice(0, 3)
    .map((x) => x.t.name.en);

  if (!match) {
    return res.json({ result: null, message: "No matching test found. Try a different name." });
  }

  res.json({
    result: localize(match.item, lang),
    matchConfidence: Math.round(match.score * 100),
    correctedFrom: match.matchedAlias !== q.toLowerCase() ? q : null,
  });
});

router.get("/:id", (req, res) => {
  const lang = req.query.lang || "en";
  const test = tests.find((t) => t.id === req.params.id);
  if (!test) return res.status(404).json({ error: "Test not found." });
  res.json({ test: localize(test, lang) });
});

// Log a search + optionally return result, for signed-in users (Recent Searches on dashboard)
router.post("/log-search", requireAuth, async (req, res) => {
  const { query } = req.body;
  await addRecentSearch(req.userId, query, "test");
  res.json({ message: "logged" });
});

export default router;
