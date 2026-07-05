// Simple Levenshtein distance implementation — no external dependency needed.
export function levenshtein(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

// Returns a 0-1 similarity score (1 = identical)
export function similarity(a, b) {
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length) || 1;
  return 1 - dist / maxLen;
}

// Finds the best fuzzy match for `query` among a list of items, checking
// each item's aliases[] array. Returns { item, matchedAlias, score } or null.
export function findBestMatch(query, items, threshold = 0.6) {
  let best = null;
  const q = query.toLowerCase().trim();
  for (const item of items) {
    for (const alias of item.aliases) {
      const score = similarity(q, alias);
      if (!best || score > best.score) {
        best = { item, matchedAlias: alias, score };
      }
    }
  }
  if (best && best.score >= threshold) return best;
  return null;
}

// Scans a longer block of text (e.g. OCR output) and finds all items whose
// aliases appear as substrings or close fuzzy matches within it.
export function findMentionsInText(text, items, threshold = 0.75) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const found = new Map();
  for (const item of items) {
    for (const alias of item.aliases) {
      const aliasWords = alias.split(" ");
      // substring check on the raw text first (fast path, handles multi-word aliases)
      if (text.toLowerCase().includes(alias)) {
        found.set(item.id, { item, matchedAlias: alias, score: 1, method: "exact" });
        continue;
      }
      // fuzzy check word-by-word for single-word aliases (handles OCR typos)
      if (aliasWords.length === 1) {
        for (const w of words) {
          const score = similarity(w, alias);
          if (score >= threshold) {
            const existing = found.get(item.id);
            if (!existing || score > existing.score) {
              found.set(item.id, { item, matchedAlias: alias, score, method: "fuzzy" });
            }
          }
        }
      }
    }
  }
  return Array.from(found.values());
}
