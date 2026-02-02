import React, { createContext, useEffect, useMemo, useState } from "react";


const STORAGE_KEY = "theme";

export type Theme = "dark" | "light";

export type ThemeCtx = {
    theme: Theme;
    setTheme: (t: Theme) => void;
    toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeCtx | null>(null);

export function safeReadTheme(): Theme {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        if (v === "light" || v === "dark") return v;
    } catch {
        // ignore
    }
    return "dark";
}

export function safeWriteTheme(theme: Theme) {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // ignore
    }
}

export function applyThemeToDom(theme: Theme) {
    document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => safeReadTheme());

    const setTheme = (t: Theme) => setThemeState(t);
    const toggleTheme = () => setThemeState((t) => (t === "dark" ? "light" : "dark"));

    useEffect(() => {
        applyThemeToDom(theme);
        safeWriteTheme(theme);
    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

    return <ThemeContext.Provider value={value}> {children} </ThemeContext.Provider>;
}