import React from "react";
import ChatPanel from "../components/ChatPanel.jsx";
import { useLang } from "../context/LangContext.jsx";

export default function AIAssistant() {
  const { t } = useLang();
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">🤖 {t("askAI")}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
        Ask about any test or medicine — why it's prescribed, side effects, normal ranges, or what a result means.
        Speak your question or type it, in English, Telugu, or Hindi.
      </p>
      <ChatPanel variant="page" />
    </div>
  );
}
