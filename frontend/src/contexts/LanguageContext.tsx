"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import {
    translations,
    type Locale,
    type TranslationKeys,
} from "@/i18n/translations";

interface LanguageContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextValue>({
    locale: "en",
    setLocale: () => { },
    t: translations.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en");

    useEffect(() => {
        const saved = localStorage.getItem("kezar-locale") as Locale | null;
        if (saved && saved in translations) {
            setLocaleState(saved);
        }
    }, []);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem("kezar-locale", newLocale);
    }, []);

    return (
        <LanguageContext.Provider
            value={{ locale, setLocale, t: translations[locale] }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
