import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLang } from "../context/LangContext.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

const NAV_LINKS = [
  { to: "/", key: "home" },
  { to: "/upload", key: "uploadPrescription" },
  { to: "/search-medicine", key: "searchMedicine" },
  { to: "/search-test", key: "searchTest" },
  { to: "/ai-assistant", key: "navAI" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [dark, setDark] = useState(localStorage.getItem("mediplain_theme") === "dark");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("mediplain_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-700 dark:text-brand-500">
          <span className="text-2xl">🩺</span> {t("appName")}
        </Link>

        <div className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-brand-600 transition">
              {t(l.key)}
            </Link>
          ))}
          {user && (
            <Link to="/dashboard" className="hover:text-brand-600 transition">
              {t("dashboard")}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition hover:scale-105"
            title="Toggle dark mode"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          {user ? (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="hidden sm:inline text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-red-500 transition"
            >
              {t("logout")}
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-semibold px-4 py-2 rounded-full border border-brand-600 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-800 transition"
              >
                {t("login")}
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-brand-600 text-white hover:bg-brand-700 transition shadow"
              >
                {t("signup")}
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
            title="Menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass border-t border-slate-200 dark:border-slate-700 px-4 py-4 space-y-3 animate-fade-in-up">
          <div className="flex flex-col gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="hover:text-brand-600">
                {t(l.key)}
              </Link>
            ))}
            {user && (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="hover:text-brand-600">
                {t("dashboard")}
              </Link>
            )}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
            <LanguageSwitcher />
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                  navigate("/");
                }}
                className="text-sm font-semibold text-red-500"
              >
                {t("logout")}
              </button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-semibold px-3 py-1.5 rounded-full border border-brand-600 text-brand-600">
                  {t("login")}
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-sm font-semibold px-3 py-1.5 rounded-full bg-brand-600 text-white">
                  {t("signup")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
