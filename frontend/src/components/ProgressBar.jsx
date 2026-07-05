import React from "react";

export default function ProgressBar({ percent, label }) {
  return (
    <div className="w-full">
      {label && <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>}
      <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  );
}
