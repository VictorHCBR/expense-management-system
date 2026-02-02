import type { TextareaHTMLAttributes } from "react";
import styles from "./TextArea.module.css";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    error?: string;
};

export function TextArea({ label, error, className, ...props }: Props) {
    return (
        <label className={[styles.field, className].filter(Boolean).join(" ")}>
            <span className={styles.label}>{label}</span>
            <textarea className={styles.textarea} {...props} />
            {error && <span className={styles.error}>{error}</span>}
        </label>
    );
}
