import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLang } from "../context/LangContext.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

export default function Upload() {
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stage, setStage] = useState("idle"); // idle | uploading | analyzing | done
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  function onFile(f) {
    if (!f) return;
    setFile(f);
    setResult(null);
    setError(null);
    setStage("idle");
    setUploadProgress(0);
    if (f.type.startsWith("image/")) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  function onDrop(e) {
    e.preventDefault();
    onFile(e.dataTransfer.files?.[0]);
  }

  async function handleUpload() {
    if (!user) return navigate("/login");
    if (!file) return;
    setError(null);
    setStage("uploading");
    setUploadProgress(0);
    try {
      const data = await api.uploadPrescriptionWithProgress(file, (pct) => {
        setUploadProgress(pct);
        if (pct >= 100) setStage("analyzing"); // OCR runs server-side after upload completes
      });
      setResult(data);
      setStage("done");
    } catch (err) {
      setError(err.message);
      setStage("idle");
    }
  }

  function downloadPdf() {
    if (!result) return;
    const doc = new jsPDF();
    let y = 15;
    doc.setFontSize(16);
    doc.text("MediPlain - Prescription OCR Results", 10, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(`OCR Confidence: ${result.ocrConfidence}%`, 10, y);
    y += 8;

    doc.setFontSize(12);
    doc.text("Detected Tests:", 10, y);
    y += 7;
    doc.setFontSize(10);
    if (result.matchedTests.length === 0) {
      doc.text("None detected", 12, y);
      y += 6;
    }
    result.matchedTests.forEach((m) => {
      doc.text(`- ${m.name} (confidence ${m.confidence}%)`, 12, y);
      y += 6;
    });

    y += 4;
    doc.setFontSize(12);
    doc.text("Detected Medicines:", 10, y);
    y += 7;
    doc.setFontSize(10);
    if (result.matchedMedicines.length === 0) {
      doc.text("None detected", 12, y);
      y += 6;
    }
    result.matchedMedicines.forEach((m) => {
      doc.text(`- ${m.name} (confidence ${m.confidence}%)`, 12, y);
      y += 6;
    });

    y += 6;
    doc.setFontSize(12);
    doc.text("Extracted Raw Text:", 10, y);
    y += 7;
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(result.extractedText || "(none)", 180);
    doc.text(lines, 10, y);

    doc.save("mediplain-ocr-results.pdf");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t("uploadPrescription")}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
        Upload a photo of a prescription — printed or handwritten. If an ANTHROPIC_API_KEY is set on the backend, AI Vision OCR reads handwriting too; otherwise Tesseract handles printed text only.
      </p>

      {!user && (
        <div className="mb-6 text-sm text-amber-700 bg-amber-50 dark:bg-amber-900/30 rounded-lg px-4 py-3">
          Please <Link to="/login" className="underline font-semibold">log in</Link> to upload and save prescriptions.
        </div>
      )}

      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="glass border-2 border-dashed border-brand-300 rounded-2xl p-10 text-center cursor-pointer hover:border-brand-500 hover:shadow-md transition"
      >
        {preview ? (
          <img src={preview} alt="preview" className="max-h-64 mx-auto rounded-lg shadow" />
        ) : (
          <>
            <div className="text-4xl mb-3">📄</div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              {file ? file.name : "Drag & drop a prescription here, or click to browse"}
            </p>
            <p className="text-xs text-slate-400 mt-1">JPG, PNG (PDF support coming soon)</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleUpload}
          disabled={!file || stage === "uploading" || stage === "analyzing"}
          className="px-8 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-lg disabled:opacity-50 transition active:scale-95"
        >
          {stage === "uploading" ? "Uploading..." : stage === "analyzing" ? "Reading prescription..." : "Extract & Analyze"}
        </button>
      </div>

      {(stage === "uploading" || stage === "analyzing") && (
        <div className="mt-6 max-w-sm mx-auto space-y-2">
          <ProgressBar
            percent={stage === "analyzing" ? 100 : uploadProgress}
            label={stage === "uploading" ? `Uploading... ${uploadProgress}%` : "Running OCR & matching against database..."}
          />
        </div>
      )}

      {error && <div className="mt-6 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-4 py-3">{error}</div>}

      {result && (
        <div className="mt-10 space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Results</h2>
            <button onClick={downloadPdf} className="text-sm px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              ⬇ Download as PDF
            </button>
          </div>

          <div className="glass rounded-xl p-4 text-sm">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className="font-semibold">OCR Confidence</span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    result.ocrMethod === "ai-vision"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {result.ocrMethod === "ai-vision" ? "🤖 AI Vision OCR" : result.ocrMethod === "tesseract-fallback" ? "⚠️ Tesseract (AI fallback)" : "Tesseract OCR"}
                </span>
                {result.isHandwritten && (
                  <span className="text-xs px-2 py-1 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-medium">
                    ✍️ Handwriting detected
                  </span>
                )}
                <span>{result.ocrConfidence}%</span>
              </div>
            </div>
            <ProgressBar percent={result.ocrConfidence} />
            {result.lowConfidenceWarning && (
              <p className="text-amber-600 mt-3">{result.lowConfidenceWarning}</p>
            )}
          </div>

          <ResultSection title="Extracted Tests" items={result.matchedTests} type="test" />
          <ResultSection title="Extracted Medicines" items={result.matchedMedicines} type="medicine" />

          <details className="glass rounded-xl p-4">
            <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-200">Raw Extracted Text</summary>
            <pre className="mt-3 whitespace-pre-wrap text-xs text-slate-500 dark:text-slate-400">{result.extractedText || "(no text detected)"}</pre>
          </details>
        </div>
      )}
    </div>
  );
}

function ResultSection({ title, items, type }) {
  return (
    <div>
      <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">None detected.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((m) => (
            <Link
              key={m.id}
              to={type === "test" ? `/search-test?q=${m.name}` : `/search-medicine?q=${m.name}`}
              className="glass rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <p className="font-medium text-slate-800 dark:text-white">{m.name}</p>
              <p className="text-xs text-slate-400">Match confidence: {m.confidence}% ({m.method})</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
