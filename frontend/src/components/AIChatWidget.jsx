import React, { useState } from "react";
import ChatPanel from "./ChatPanel.jsx";

/**
 * Floating quick-access chat bubble. Reuses ChatPanel (the same component
 * that powers the full /ai-assistant page) so chat logic lives in one place.
 */
export default function AIChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-80 sm:w-96 h-[28rem] rounded-2xl shadow-2xl glass overflow-hidden animate-fade-in-up">
          <ChatPanel variant="widget" />
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-2xl shadow-xl flex items-center justify-center transition active:scale-95"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
