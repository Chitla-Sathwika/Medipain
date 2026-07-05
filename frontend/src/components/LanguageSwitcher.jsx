import React from "react";
import { useLang } from "../context/LangContext.jsx";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिंदी" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex gap-1 rounded-full bg-slate-100 dark:bg-slate-800 p-1 text-sm">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-3 py-1 rounded-full transition ${
            lang === l.code
              ? "bg-brand-500 text-white shadow"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
