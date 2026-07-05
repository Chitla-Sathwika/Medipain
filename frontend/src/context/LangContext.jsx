import React, { createContext, useContext, useState, useEffect } from "react";
import { t as translate } from "../i18n.js";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("mediplain_lang") || "en");

  useEffect(() => {
    localStorage.setItem("mediplain_lang", lang);
  }, [lang]);

  const t = (key) => translate(lang, key);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
