import React, { useState } from "react";
import { useLang } from "../context/LangContext.jsx";

/**
 * Reusable search bar with an integrated microphone button.
 * Used by SearchTest, SearchMedicine, and the AI Assistant page so the
 * voice-search behavior lives in exactly one place.
 */
export default function VoiceInput({ value, onChange, onSubmit, placeholder, suggestions = [], listId }) {
  const { lang } = useLang();
  const [listening, setListening] = useState(false);

  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search isn't supported in this browser. Try Chrome.");
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = lang === "te" ? "te-IN" : lang === "hi" ? "hi-IN" : "en-IN";
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onChange(transcript);
      onSubmit(transcript);
    };
    rec.start();
  }

  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        placeholder={placeholder}
        list={listId}
        className="flex-1 rounded-full border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 transition"
      />
      {listId && suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
      <button
        type="button"
        onClick={startVoice}
        title="Voice search"
        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition ${
          listening ? "bg-red-500 text-white animate-pulse" : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
        }`}
      >
        🎤
      </button>
      <button
        type="button"
        onClick={() => onSubmit()}
        className="px-6 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold transition active:scale-95"
      >
        Search
      </button>
    </div>
  );
}
