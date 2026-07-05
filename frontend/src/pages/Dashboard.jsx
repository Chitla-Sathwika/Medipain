import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLang } from "../context/LangContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const { lang, setLang, t } = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard().then(setData).finally(() => setLoading(false));
  }, []);

  async function removeBookmark(itemType, itemId) {
    await api.removeBookmark(itemType, itemId);
    setData((d) => ({ ...d, bookmarks: d.bookmarks.filter((b) => !(b.item_id === itemId && b.item_type === itemType)) }));
  }

  if (loading) return <div className="text-center py-20 text-slate-400">Loading dashboard...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{t("dashboard")}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Welcome back, {user?.name}!</p>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="glass rounded-2xl p-5">
          <h2 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">📜 {t("recentSearches")}</h2>
          {data.recentSearches.length === 0 ? (
            <p className="text-sm text-slate-400">No searches yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.recentSearches.map((s, i) => (
                <li key={i} className="flex justify-between">
                  <Link to={s.type === "test" ? `/search-test?q=${s.query}` : `/search-medicine?q=${s.query}`} className="hover:text-brand-600">
                    {s.query}
                  </Link>
                  <span className="text-xs text-slate-400 uppercase">{s.type}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">⭐ {t("bookmarks")}</h2>
          {data.bookmarks.length === 0 ? (
            <p className="text-sm text-slate-400">No bookmarks yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.bookmarks.map((b, i) => (
                <li key={i} className="flex justify-between items-center">
                  <Link to={b.item_type === "test" ? `/search-test?q=${b.name}` : `/search-medicine?q=${b.name}`} className="hover:text-brand-600">
                    {b.name} <span className="text-xs text-slate-400 uppercase ml-1">({b.item_type})</span>
                  </Link>
                  <button onClick={() => removeBookmark(b.item_type, b.item_id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">📄 {t("uploadedPrescriptions")}</h2>
          {data.uploads.length === 0 ? (
            <p className="text-sm text-slate-400">No prescriptions uploaded yet.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {data.uploads.map((u) => (
                <li key={u.id} className="border-b border-slate-200 dark:border-slate-700 pb-2">
                  <p className="font-medium text-slate-700 dark:text-slate-200">{u.filename}</p>
                  <p className="text-xs text-slate-400">
                    {u.matched_tests.length} tests, {u.matched_medicines.length} medicines detected · {new Date(u.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">🌐 {t("preferredLanguage")}</h2>
          <div className="flex gap-2">
            {[
              { code: "en", label: "English" },
              { code: "te", label: "తెలుగు" },
              { code: "hi", label: "हिंदी" },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  api.updateProfile({ preferredLanguage: l.code });
                }}
                className={`px-4 py-2 rounded-full text-sm ${lang === l.code ? "bg-brand-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
