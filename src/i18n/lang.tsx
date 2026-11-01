import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "fa" | "en";
/** A string in both languages. */
export type L = { fa: string; en: string };
export type Text = L | string;

type LangValue = {
  lang: Lang;
  isFa: boolean;
  dir: "rtl" | "ltr";
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (s: Text) => string;
  /** Number in the current script (Persian digits in fa). */
  num: (n: number, opts?: Intl.NumberFormatOptions) => string;
  /** Replace Latin digits inside a string with Persian ones when the language is fa. */
  digits: (s: string) => string;
};

const LangContext = createContext<LangValue | null>(null);

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
export const toFaDigits = (s: string) => s.replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

const TITLES: Record<Lang, string> = {
  fa: "امیرحسین سدنی — توسعه‌دهنده نرم‌افزار · SDN",
  en: "Amirhossein Sadani — Software Developer · SDN",
};

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    document.documentElement.lang === "en" ? "en" : "fa",
  );

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("sdn-lang", l);
    } catch {
      /* private mode: the choice just isn't remembered */
    }
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "fa" ? "rtl" : "ltr";
    document.title = TITLES[lang];
  }, [lang]);

  const value = useMemo<LangValue>(() => {
    const isFa = lang === "fa";
    const nf = new Intl.NumberFormat(isFa ? "fa-IR" : "en-US");
    return {
      lang,
      isFa,
      dir: isFa ? "rtl" : "ltr",
      setLang,
      toggle: () => setLang(isFa ? "en" : "fa"),
      t: (s) => (typeof s === "string" ? s : s[lang]),
      num: (n, opts) => (opts ? new Intl.NumberFormat(isFa ? "fa-IR" : "en-US", opts).format(n) : nf.format(n)),
      digits: (s) => (isFa ? toFaDigits(s) : s),
    };
  }, [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const v = useContext(LangContext);
  if (!v) throw new Error("useLang must be used inside <LangProvider>");
  return v;
}
