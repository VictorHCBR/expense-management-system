import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "../ui/ThemeToggle/ThemeToggle";
import styles from "./AppLayout.module.css";

type Props = { children: ReactNode };

export function AppLayout({ children }: Props) {
    return (
        <div className={styles.shell}>
            <header className={styles.header}>
                <div className={styles.brand}>
                    <span className={styles.dot} aria-hidden="true" />
                    <div>
                        <div className={styles.title}>Controle de Gastos</div>
                        <div className={styles.subtitle}>Residencial • </div>
                    </div>
                </div>

                <div className={styles.right}>
                    <nav className={styles.nav} aria-label="Navegação">
                        <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
                            Início
                        </NavLink>
                        <NavLink to="/people" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
                            Pessoas
                        </NavLink>
                        <NavLink to="/categories" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
                            Categorias
                        </NavLink>
                        <NavLink to="/transactions" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
                            Transações
                        </NavLink>
                        <NavLink to="/reports" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
                            Relatórios
                        </NavLink>
                    </nav>

                    <ThemeToggle />
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.container}>{children}</div>
            </main>

            <footer className={styles.footer}>
                <span>API: .NET + EF Core + PostgreSQL • UI: React + CSS</span>
            </footer>
        </div>
    );
}
