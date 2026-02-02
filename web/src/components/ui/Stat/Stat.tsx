import styles from "./Stat.module.css";

type Props = {
    label: string;
    value: string;
    hint?: string;
    tone?: "neutral" | "ok" | "warn";
};

export function Stat({ label, value, hint, tone = "neutral" }: Props) {
    return (
        <div className={[styles.stat, styles[tone]].join(" ")}>
            <div className={styles.label}>{label}</div>
            <div className={styles.value}>{value}</div>
            {hint && <div className={styles.hint}>{hint}</div>}
        </div>
    );
}
