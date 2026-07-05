import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api.js";
import { useLang } from "../context/LangContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import VoiceInput from "../components/VoiceInput.jsx";
import TestCard from "../components/TestCard.jsx";

const COMMON = ["CBC", "Blood Sugar Test", "Lipid Profile", "Thyroid Test", "Liver Function Test", "Vitamin D Test"];

export default function SearchTest() {
  const { lang, t } = useLang();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [correctedFrom, setCorrectedFrom] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => setSaved(false), [result]);

  const location = useLocation();
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q");
    if (q) {
      setQuery(q);
      runSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  async function runSearch(q) {
    const query_ = (q ?? query).trim();
    if (!query_) return;
    setNotFound(false);
    setCorrectedFrom(null);
    try {
      const data = await api.searchTest(query_, lang);
      if (!data.result) {
        setResult(null);
        setNotFound(true);
      } else {
        setResult(data.result);
        setCorrectedFrom(data.correctedFrom);
      }
      if (user) api.logTestSearch(query_).catch(() => {});
    } catch (e) {
      setNotFound(true);
    }
  }

  function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === "te" ? "te-IN" : lang === "hi" ? "hi-IN" : "en-IN";
    window.speechSynthesis.speak(utter);
  }

  async function toggleBookmark() {
    if (!user) return alert("Please log in to bookmark items.");
    await api.addBookmark(result.id, "test");
    setSaved(true);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t("searchTest")}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Search by name, e.g. "CBC", "Blood Sugar Test", "Lipid Profile"</p>

      <div className="mb-3">
        <VoiceInput
          value={query}
          onChange={setQuery}
          onSubmit={runSearch}
          placeholder="Search a medical test..."
          suggestions={COMMON}
          listId="test-suggestions"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {COMMON.map((c) => (
          <button
            key={c}
            onClick={() => {
              setQuery(c);
              runSearch(c);
            }}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-700 transition"
          >
            {c}
          </button>
        ))}
      </div>

      {notFound && (
        <div className="glass rounded-xl p-5 text-slate-600 dark:text-slate-300 animate-fade-in-up">No matching test found. Try a different name.</div>
      )}

      <TestCard test={result} correctedFrom={correctedFrom} onBookmark={toggleBookmark} bookmarked={saved} onListen={speak} />
    </div>
  );
}
