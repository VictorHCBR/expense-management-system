import type { ReactNode } from "react";
import styles from "./Table.module.css";

type Props = {
    headers: string[];
    rows: ReactNode[][];
    caption?: string;
};

export function Table({ headers, rows, caption }: Props) {
    return (
        <div className={styles.wrap}>
            <table className={styles.table}>
                {caption && <caption className={styles.caption}>{caption}</caption>}
                <thead>
                    <tr>
                        {headers.map((h) => (
                            <th key={h}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={headers.length} className={styles.empty}>
                                Nenhum registro.
                            </td>
                        </tr>
                    ) : (
                        rows.map((cols, i) => (
                            <tr key={i}>
                                {cols.map((c, j) => (
                                    <td key={j}>{c}</td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
