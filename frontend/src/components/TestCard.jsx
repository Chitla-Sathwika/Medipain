import React from "react";
import { useLang } from "../context/LangContext.jsx";

function Field({ label, value, highlight }) {
  if (!value) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</h3>
      <p className={highlight ? "text-brand-600 dark:text-brand-400 font-semibold" : "text-slate-700 dark:text-slate-200"}>{value}</p>
    </div>
  );
}

/**
 * Detailed medical test card: purpose, why doctors recommend it, what it
 * detects, normal range, abnormal conditions, preparation, cost, and FAQs.
 */
export default function TestCard({ test, correctedFrom, onBookmark, bookmarked, onListen }) {
  const { t } = useLang();
  if (!test) return null;

  return (
    <div className="glass rounded-2xl p-6 shadow-lg space-y-4 animate-fade-in-up">
      {correctedFrom && (
        <div className="text-xs text-amber-700 bg-amber-50 dark:bg-amber-900/30 rounded-lg px-3 py-1.5 inline-block">
          Showing results for "{test.name}" (corrected from "{correctedFrom}")
        </div>
      )}
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{test.name}</h2>
        <div className="flex gap-2">
          {onListen && (
            <button onClick={() => onListen(test.purpose)} className="text-lg hover:scale-110 transition" title="Listen">🔊</button>
          )}
          {onBookmark && (
            <button onClick={onBookmark} className="text-lg hover:scale-110 transition" title="Bookmark">{bookmarked ? "⭐" : "☆"}</button>
          )}
        </div>
      </div>
      <p className="text-slate-600 dark:text-slate-300">{test.purpose}</p>

      <Field label={t("whyRecommended")} value={test.whyRecommended} />
      <Field label={t("detects")} value={test.detects} />
      <Field label={t("normalRange")} value={test.normalRange} />
      <Field label={t("abnormal")} value={test.abnormal} />
      <Field label={t("preparation")} value={test.preparation} />
      <Field label={t("cost")} value={test.costRange} highlight />

      {test.faqs?.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">FAQs</h3>
          <div className="space-y-2">
            {test.faqs.map((f, i) => (
              <div key={i} className="text-sm">
                <p className="font-medium text-slate-700 dark:text-slate-200">Q: {f.q}</p>
                <p className="text-slate-500 dark:text-slate-400">A: {f.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
