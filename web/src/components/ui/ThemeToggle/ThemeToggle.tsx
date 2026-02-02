import { Button } from "../Button/Button";
import { useTheme } from "../../../theme/ThemeContext";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === "dark";
    const label = isDark ? "Alternar para tema claro" : "Alternar para tema escuro";

    return (
        <Button
            variant="ghost"
            className={styles.toggle}
            onClick={toggleTheme}
            aria-label={label}
            title={label}
            type="button"
        >
            <span className={styles.icon} aria-hidden="true">{isDark ? "🌙" : "☀️"}</span>
            <span className={styles.text}>{isDark ? "Escuro" : "Claro"}</span>
        </Button>
    );
}
