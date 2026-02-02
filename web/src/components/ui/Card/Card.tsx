import type { ReactNode } from "react";
import styles from "./Card.module.css";

type Props = {
    title?: string;
    description?: string;
    actions?: ReactNode;
    children: ReactNode;
};

export function Card({ title, description, actions, children }: Props) {
    return (
        <section className={styles.card}>
            {(title || actions || description) && (
                <header className={styles.header}>
                    <div>
                        {title && <h2 className={styles.title}>{title}</h2>}
                        {description && <p className={styles.desc}>{description}</p>}
                    </div>
                    {actions && <div className={styles.actions}>{actions}</div>}
                </header>
            )}
            <div className={styles.body}>{children}</div>
        </section>
    );
}
