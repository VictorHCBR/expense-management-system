import { useContext } from "react";
import { ThemeContext } from './ThemeContext.constants';
import type { ThemeCtx } from "./ThemeContext.constants";

export function useTheme(): ThemeCtx {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
