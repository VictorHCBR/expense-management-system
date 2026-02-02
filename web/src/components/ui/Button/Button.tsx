import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "ghost" | "danger";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ variant = "primary", className, ...props }: Props) {
    const cls = [styles.btn, styles[variant], className].filter(Boolean).join(" ");
    return <button className={cls} {...props} />;
}
