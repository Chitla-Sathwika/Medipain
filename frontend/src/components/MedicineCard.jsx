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
 * Detailed medicine card: name, generic name, uses, dosage, side effects,
 * precautions, interactions, and approximate cost — with bookmark/listen
 * actions. Used by SearchMedicine and (as a compact preview) OCR results.
 */
export default function MedicineCard({ medicine, correctedFrom, onBookmark, bookmarked, onListen }) {
  const { t } = useLang();
  if (!medicine) return null;

  return (
    <div className="glass rounded-2xl p-6 shadow-lg space-y-4 animate-fade-in-up">
      {correctedFrom && (
        <div className="text-xs text-amber-700 bg-amber-50 dark:bg-amber-900/30 rounded-lg px-3 py-1.5 inline-block">
          Showing results for "{medicine.name}" (corrected from "{correctedFrom}")
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{medicine.name}</h2>
          <p className="text-xs text-slate-400">{t("genericName")}: {medicine.genericName}</p>
        </div>
        <div className="flex gap-2">
          {onListen && (
            <button onClick={() => onListen(medicine.uses)} className="text-lg hover:scale-110 transition" title="Listen">🔊</button>
          )}
          {onBookmark && (
            <button onClick={onBookmark} className="text-lg hover:scale-110 transition" title="Bookmark">{bookmarked ? "⭐" : "☆"}</button>
          )}
        </div>
      </div>
      <p className="text-slate-600 dark:text-slate-300">{medicine.uses}</p>

      <Field label={t("whyPrescribed")} value={medicine.whyPrescribed} />
      <Field label={t("dosage")} value={medicine.dosage} />
      <Field label={t("sideEffects")} value={medicine.sideEffects} />
      <Field label={t("precautions")} value={medicine.precautions} />
      <Field label={t("interactions")} value={medicine.interactions} />
      <Field label={t("cost")} value={medicine.costRange} highlight />

      <div className="text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3">
        {medicine.disclaimer || "This information is for educational purposes only. Always follow your doctor's advice."}
      </div>
    </div>
  );
}
