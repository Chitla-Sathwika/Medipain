import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useLang } from "../context/LangContext.jsx";

export default function ForgotPassword() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [devLink, setDevLink] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.forgotPassword(email);
      setMessage(data.message);
      setDevLink(data.devResetLink);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass w-full max-w-md rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-6">{t("forgotPassword")}</h1>
        {message && <div className="mb-4 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">{message}</div>}
        {devLink && (
          <div className="mb-4 text-xs text-amber-700 bg-amber-50 dark:bg-amber-900/30 rounded-lg px-3 py-2">
            Demo mode — no real email sending configured. Reset link: <code>{devLink}</code>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">{t("email")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 outline-none focus:border-brand-500"
            />
          </div>
          <button disabled={loading} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60">
            {loading ? "..." : "Send Reset Link"}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">Back to {t("login")}</Link>
        </p>
      </div>
    </div>
  );
}
