import styles from "./Badge.module.css";

type Variant = "neutral" | "ok" | "warn";

type Props = {
    text: string;
    variant?: Variant;
};

export function Badge({ text, variant = "neutral" }: Props) {
    return <span className={[styles.badge, styles[variant]].join(" ")}>{text}</span>;
}
