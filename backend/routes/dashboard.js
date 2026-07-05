import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { tests, medicines } from "../data/seed.js";
import {
  getRecentSearches,
  getBookmarks,
  getUploads,
  getUserById,
  addBookmark,
  removeBookmark,
} from "../db.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", (req, res) => {
  const recentSearches = getRecentSearches(req.userId, 10);
  const bookmarks = getBookmarks(req.userId);
  const uploads = getUploads(req.userId, 10);
  const user = getUserById(req.userId);

  const hydratedBookmarks = bookmarks.map((b) => {
    const source = b.itemType === "test" ? tests : medicines;
    const found = source.find((x) => x.id === b.itemId);
    return { item_id: b.itemId, item_type: b.itemType, created_at: b.createdAt, name: found?.name.en || b.itemId };
  });

  res.json({
    recentSearches: recentSearches.map((s) => ({ query: s.query, type: s.type, created_at: s.createdAt })),
    bookmarks: hydratedBookmarks,
    uploads: uploads.map((u) => ({
      id: u.id,
      filename: u.filename,
      created_at: u.createdAt,
      matched_tests: u.matchedTests || [],
      matched_medicines: u.matchedMedicines || [],
    })),
    preferredLanguage: user?.preferredLanguage || "en",
  });
});

router.post("/bookmarks", async (req, res) => {
  const { itemId, itemType } = req.body;
  if (!itemId || !itemType) return res.status(400).json({ error: "itemId and itemType are required." });
  await addBookmark(req.userId, itemId, itemType);
  res.json({ message: "Bookmarked." });
});

router.delete("/bookmarks/:itemType/:itemId", async (req, res) => {
  await removeBookmark(req.userId, req.params.itemId, req.params.itemType);
  res.json({ message: "Removed." });
});

export default router;
