import styles from "./Alert.module.css";

type Variant = "info" | "error";

type Props = {
    title: string;
    message: string;
    variant?: Variant;
};

export function Alert({ title, message, variant = "info" }: Props) {
    return (
        <div className={[styles.alert, styles[variant]].join(" ")} role={variant === "error" ? "alert" : "status"}>
            <div className={styles.title}>{title}</div>
            <div className={styles.msg}>{message}</div>
        </div>
    );
}
