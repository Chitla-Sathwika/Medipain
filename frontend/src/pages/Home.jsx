import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext.jsx";

const FEATURES = [
  { icon: "📄", title: "OCR Prescription Reading", desc: "Upload a photo of your prescription and let MediPlain extract the tests and medicines automatically." },
  { icon: "🧠", title: "AI Medical Explanations", desc: "Get plain-language explanations of why a test or medicine was prescribed." },
  { icon: "🌐", title: "Multi-Language Support", desc: "Everything works in English, Telugu, and Hindi." },
  { icon: "🎤", title: "Voice Search", desc: "Speak your question naturally instead of typing." },
  { icon: "💊", title: "Medicine Information", desc: "Uses, dosage, side effects, precautions, and approximate cost." },
  { icon: "🧪", title: "Test Information", desc: "Purpose, normal ranges, preparation needed, and approximate cost." },
];

const STEPS = [
  { n: 1, title: "Upload Prescription", desc: "Take a photo or upload a scanned prescription." },
  { n: 2, title: "Extract Text", desc: "Our OCR engine reads the printed text." },
  { n: 3, title: "Identify Tests & Medicines", desc: "We match extracted text against our medical database." },
  { n: 4, title: "Get Explanations Instantly", desc: "See clear, simple explanations for everything found." },
];

const FAQS = [
  { q: "Is MediPlain a replacement for my doctor?", a: "No. MediPlain explains tests and medicines in simple language, but you should always follow your doctor's advice for diagnosis and treatment." },
  { q: "Which languages are supported?", a: "English, Telugu, and Hindi today, with more planned." },
  { q: "Is my uploaded prescription stored securely?", a: "Prescriptions are processed to extract text and are not shared with third parties. In this demo build they're stored locally in your own database." },
];

export default function Home() {
  const { t } = useLang();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white dark:from-slate-800 dark:to-slate-900 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">{t("heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/upload" className="px-6 py-3 rounded-full bg-brand-600 text-white font-semibold shadow-lg hover:bg-brand-700 transition">
              {t("uploadPrescription")}
            </Link>
            <Link to="/search-medicine" className="px-6 py-3 rounded-full glass font-semibold text-brand-700 dark:text-brand-400 shadow hover:scale-105 transition">
              {t("searchMedicine")}
            </Link>
            <Link to="/search-test" className="px-6 py-3 rounded-full glass font-semibold text-brand-700 dark:text-brand-400 shadow hover:scale-105 transition">
              {t("searchTest")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-10">{t("features")}</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-1">{f.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 dark:bg-slate-800/50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-10">{t("howItWorks")}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-brand-600 text-white font-bold flex items-center justify-center mb-3">
                  {s.n}
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white">{s.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-10">What people say</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: "Anitha R.", role: "Patient", text: "I finally understood why my doctor prescribed a thyroid test — explained so simply." },
            { name: "Kiran V.", role: "Caregiver", text: "Uploading my father's prescription and getting instant explanations saved us a lot of confusion." },
            { name: "Meena S.", role: "Patient", text: "Being able to read explanations in Telugu made all the difference for my parents." },
          ].map((tItem) => (
            <div key={tItem.name} className="glass rounded-2xl p-6 shadow-sm">
              <p className="text-slate-600 dark:text-slate-300 text-sm italic">"{tItem.text}"</p>
              <p className="mt-4 font-semibold text-slate-800 dark:text-white text-sm">{tItem.name}</p>
              <p className="text-xs text-slate-400">{tItem.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 dark:bg-slate-800/50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-10">{t("faq")}</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 font-medium text-slate-800 dark:text-white flex justify-between items-center"
                >
                  {f.q}
                  <span>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <div className="flex justify-center gap-6 mb-3">
          <a href="#" className="hover:text-brand-600">About Us</a>
          <a href="#" className="hover:text-brand-600">Contact</a>
          <a href="#" className="hover:text-brand-600">Privacy Policy</a>
          <a href="#" className="hover:text-brand-600">Terms & Conditions</a>
        </div>
        <p>© {new Date().getFullYear()} MediPlain. {t("disclaimer")}</p>
      </footer>
    </div>
  );
}
