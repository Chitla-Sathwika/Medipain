import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  getUserByVerificationToken,
  getUserByResetToken,
} from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "dev_secret";

function signToken(userId) {
  return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
}

// --- Sign Up ---
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }
  const existing = getUserByEmail(email.toLowerCase());
  if (existing) return res.status(409).json({ error: "An account with this email already exists." });

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(20).toString("hex");

  const user = await createUser({ name, email: email.toLowerCase(), passwordHash, verificationToken });

  // NOTE: There's no real email provider wired up (that needs an SMTP/SendGrid
  // key), so we return the verification link directly in the response instead
  // of emailing it. In production, replace this with an actual email send.
  const verifyLink = `/api/auth/verify-email?token=${verificationToken}`;

  const token = signToken(user.id);
  res.status(201).json({
    message: "Account created. Verify your email to unlock all features.",
    devVerifyLink: verifyLink,
    token,
    user: { id: user.id, name, email: email.toLowerCase(), emailVerified: false },
  });
});

// --- Email Verification ---
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  const user = getUserByVerificationToken(token);
  if (!user) return res.status(400).json({ error: "Invalid or expired verification link." });
  await updateUser(user.id, { emailVerified: true, verificationToken: null });
  res.json({ message: "Email verified successfully." });
});

// --- Login ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail((email || "").toLowerCase());
  if (!user) return res.status(401).json({ error: "Invalid email or password." });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid email or password." });

  const token = signToken(user.id);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: !!user.emailVerified,
      preferredLanguage: user.preferredLanguage,
    },
  });
});

// --- Forgot Password ---
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = getUserByEmail((email || "").toLowerCase());
  if (!user) return res.json({ message: "If that email exists, a reset link has been generated." });

  const resetToken = crypto.randomBytes(20).toString("hex");
  await updateUser(user.id, { resetToken });

  res.json({
    message: "If that email exists, a reset link has been generated.",
    devResetLink: `/reset-password?token=${resetToken}`,
  });
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  const user = getUserByResetToken(token);
  if (!user) return res.status(400).json({ error: "Invalid or expired reset link." });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await updateUser(user.id, { passwordHash, resetToken: null });
  res.json({ message: "Password reset successfully. You can now log in." });
});

// --- Profile ---
router.get("/me", requireAuth, (req, res) => {
  const user = getUserById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      preferredLanguage: user.preferredLanguage,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    },
  });
});

router.put("/me", requireAuth, async (req, res) => {
  const { name, preferredLanguage } = req.body;
  const patch = {};
  if (name) patch.name = name;
  if (preferredLanguage) patch.preferredLanguage = preferredLanguage;
  await updateUser(req.userId, patch);
  res.json({ message: "Profile updated." });
});

export default router;
