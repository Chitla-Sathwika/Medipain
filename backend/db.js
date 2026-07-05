import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";

// Using lowdb (a plain JSON file on disk) instead of MongoDB/SQLite for this
// portfolio build. It has zero native dependencies, so `npm install` works
// on any machine without build tools — and it's trivial to swap for real
// MongoDB later (the query shape below maps directly to Mongo collections).

const file = path.resolve("mediplain-db.json");
const adapter = new JSONFile(file);
const defaultData = { users: [], recentSearches: [], bookmarks: [], uploads: [], counters: { users: 0, searches: 0, bookmarks: 0, uploads: 0 } };
const db = new Low(adapter, defaultData);

await db.read();
db.data ||= structuredClone(defaultData);
await db.write();

function nextId(key) {
  db.data.counters[key] = (db.data.counters[key] || 0) + 1;
  return db.data.counters[key];
}

export async function createUser({ name, email, passwordHash, verificationToken }) {
  const user = {
    id: nextId("users"),
    name,
    email,
    passwordHash,
    preferredLanguage: "en",
    emailVerified: false,
    verificationToken,
    resetToken: null,
    createdAt: new Date().toISOString(),
  };
  db.data.users.push(user);
  await db.write();
  return user;
}

export function getUserByEmail(email) {
  return db.data.users.find((u) => u.email === email) || null;
}

export function getUserById(id) {
  return db.data.users.find((u) => u.id === id) || null;
}

export async function updateUser(id, patch) {
  const user = getUserById(id);
  if (!user) return null;
  Object.assign(user, patch);
  await db.write();
  return user;
}

export function getUserByVerificationToken(token) {
  return db.data.users.find((u) => u.verificationToken === token) || null;
}

export function getUserByResetToken(token) {
  return db.data.users.find((u) => u.resetToken === token) || null;
}

export async function addRecentSearch(userId, query, type) {
  db.data.recentSearches.unshift({ id: nextId("searches"), userId, query, type, createdAt: new Date().toISOString() });
  await db.write();
}

export function getRecentSearches(userId, limit = 10) {
  return db.data.recentSearches.filter((s) => s.userId === userId).slice(0, limit);
}

export async function addBookmark(userId, itemId, itemType) {
  const exists = db.data.bookmarks.find((b) => b.userId === userId && b.itemId === itemId && b.itemType === itemType);
  if (exists) return exists;
  const bookmark = { id: nextId("bookmarks"), userId, itemId, itemType, createdAt: new Date().toISOString() };
  db.data.bookmarks.push(bookmark);
  await db.write();
  return bookmark;
}

export async function removeBookmark(userId, itemId, itemType) {
  db.data.bookmarks = db.data.bookmarks.filter((b) => !(b.userId === userId && b.itemId === itemId && b.itemType === itemType));
  await db.write();
}

export function getBookmarks(userId) {
  return db.data.bookmarks.filter((b) => b.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function addUpload(userId, { filename, extractedText, matchedTests, matchedMedicines }) {
  const upload = {
    id: nextId("uploads"),
    userId,
    filename,
    extractedText,
    matchedTests,
    matchedMedicines,
    createdAt: new Date().toISOString(),
  };
  db.data.uploads.unshift(upload);
  await db.write();
  return upload;
}

export function getUploads(userId, limit = 10) {
  return db.data.uploads.filter((u) => u.userId === userId).slice(0, limit);
}

export default db;
