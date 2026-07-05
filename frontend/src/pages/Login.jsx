import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLang } from "../context/LangContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass w-full max-w-md rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-6">🩺 {t("login")}</h1>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">{t("email")}</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">{t("password")}</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 outline-none focus:border-brand-500"
            />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-brand-600 hover:underline">{t("forgotPassword")}</Link>
          </div>
          <button
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "..." : t("login")}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">
          {t("dontHaveAccount")} <Link to="/signup" className="text-brand-600 font-semibold hover:underline">{t("signup")}</Link>
        </p>
      </div>
    </div>
  );
}
