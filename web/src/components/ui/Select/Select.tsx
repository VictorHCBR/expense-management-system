import type { SelectHTMLAttributes } from "react";
import styles from "./Select.module.css";

type Option = { value: string | number; label: string; disabled?: boolean };

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    options: Option[];
    error?: string;
};

export function Select({ label, options, error, className, ...props }: Props) {
    return (
        <label className={[styles.field, className].filter(Boolean).join(" ")}>
            <span className={styles.label}>{label}</span>
            <select className={styles.select} {...props}>
                {options.map((o) => (
                    <option key={String(o.value)} value={o.value} disabled={o.disabled}>
                        {o.label}
                    </option>
                ))}
            </select>
            {error && <span className={styles.error}>{error}</span>}
        </label>
    );
}
