import React, { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Language, languageLabels, languageFlags } from "@/i18n/translations";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const languages: Language[] = ["en", "pt", "es", "hu"];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-border hover:bg-muted transition-colors font-body text-sm"
        aria-label="Change language"
      >
        <Globe size={16} className="text-primary" />
        <span>{languageFlags[language]}</span>
        <span className="hidden sm:inline">{languageLabels[language]}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-xl py-2 min-w-[160px] z-50 animate-scale-in">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => { setLanguage(lang); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body hover:bg-muted transition-colors ${
                language === lang ? "text-primary font-semibold bg-primary/5" : "text-foreground"
              }`}
            >
              <span className="text-lg">{languageFlags[lang]}</span>
              <span>{languageLabels[lang]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
