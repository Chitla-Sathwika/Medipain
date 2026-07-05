import React, { useState, useRef, useEffect } from "react";
import { api } from "../api.js";
import { useLang } from "../context/LangContext.jsx";

const SUGGESTED_PROMPTS = [
  "Why did my doctor prescribe CBC?",
  "What is Dolo 650 used for?",
  "What is the cost of a thyroid test?",
  "What are the side effects of Azithromycin?",
];

export default function ChatPanel({ variant = "page" }) {
  const { lang, t } = useLang();
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! Ask me about any test or medicine — e.g. 'Why did my doctor prescribe CBC?'" },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const question = (text ?? input).trim();
    if (!question) return;
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const data = await api.askAI(question, lang);
      setMessages((m) => [...m, { role: "assistant", text: data.answer }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", text: "Sorry, I couldn't reach the AI service. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

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
      setInput(transcript);
      send(transcript);
    };
    rec.start();
  }

  const isPage = variant === "page";

  return (
    <div className={isPage ? "flex flex-col h-[70vh] glass rounded-2xl overflow-hidden shadow-xl" : "flex flex-col h-full"}>
      {isPage && (
        <div className="bg-brand-600 text-white px-5 py-4 font-semibold flex items-center gap-2">
          🤖 {t("askAI")}
        </div>
      )}

      {isPage && (
        <div className="flex flex-wrap gap-2 px-4 pt-3">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-700 transition"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] px-4 py-2.5 rounded-2xl animate-fade-in-up ${
              m.role === "user"
                ? "bg-brand-500 text-white ml-auto rounded-br-sm"
                : "bg-slate-100 dark:bg-slate-800 dark:text-slate-100 mr-auto rounded-bl-sm"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <div className="text-slate-400 text-xs px-1">Thinking...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
        <button
          onClick={startVoice}
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition ${
            listening ? "bg-red-500 text-white animate-pulse" : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
          title="Voice search"
        >
          🎤
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask a question..."
          className="flex-1 bg-transparent border border-slate-300 dark:border-slate-600 rounded-full px-4 py-2 text-sm outline-none focus:border-brand-500 transition"
        />
        <button onClick={() => send()} className="bg-brand-600 hover:bg-brand-700 text-white rounded-full px-5 text-sm font-semibold transition active:scale-95">
          Send
        </button>
      </div>
    </div>
  );
}
