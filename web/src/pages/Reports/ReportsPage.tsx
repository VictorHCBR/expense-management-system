import { useEffect, useMemo, useState } from "react";
import { ReportsApi } from "../../services/api";
import { useAsync } from "../../hooks/useAync";
import type { TotalsReportResponse } from "../../types/domain";
import { formatCurrencyBRL } from "../../utils/format";
import { PageHeader } from "../../components/ui/PageHeader/PageHeader";
import { Card } from "../../components/ui/Card/Card";
import { Button } from "../../components/ui/Button/Button";
import { Spinner } from "../../components/ui/Spinner/Spinner";
import { Alert } from "../../components/ui/Alert/Alert";
import { Table } from "../../components/ui/Table/Table";
import { Stat } from "../../components/ui/Stat/Stat";
import styles from "./ReportsPage.module.css";

function tone(balance: number): "ok" | "warn" | "neutral" {
    if (balance > 0) return "ok";
    if (balance < 0) return "warn";
    return "neutral";
}

export function ReportsPage() {
    const [byPerson, setByPerson] = useState<TotalsReportResponse | null>(null);
    const [byCategory, setByCategory] = useState<TotalsReportResponse | null>(null);

    const loadAsync = useAsync(async () => {
        const [p, c] = await Promise.all([ReportsApi.totalsByPerson(), ReportsApi.totalsByCategory()]);
        setByPerson(p);
        setByCategory(c);
    });

    useEffect(() => {
        loadAsync.run().catch(() => void 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const personRows = useMemo(() => {
        const items = byPerson?.items ?? [];
        return [...items]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((i) => [
                <div key={i.id} className={styles.primary}>{i.name}</div>,
                <span key={i.id + "-in"} className={styles.moneyOk}>{formatCurrencyBRL(i.totalIncome)}</span>,
                <span key={i.id + "-ex"} className={styles.moneyWarn}>{formatCurrencyBRL(i.totalExpense)}</span>,
                <span key={i.id + "-bal"} className={styles.money}>{formatCurrencyBRL(i.balance)}</span>
            ]);
    }, [byPerson]);

    const categoryRows = useMemo(() => {
        const items = byCategory?.items ?? [];
        return [...items]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((i) => [
                <div key={i.id} className={styles.primary}>{i.name}</div>,
                <span key={i.id + "-in"} className={styles.moneyOk}>{formatCurrencyBRL(i.totalIncome)}</span>,
                <span key={i.id + "-ex"} className={styles.moneyWarn}>{formatCurrencyBRL(i.totalExpense)}</span>,
                <span key={i.id + "-bal"} className={styles.money}>{formatCurrencyBRL(i.balance)}</span>
            ]);
    }, [byCategory]);

    const gt = byPerson?.grandTotal ?? byCategory?.grandTotal ?? null;

    return (
        <div className="stack">
            <PageHeader
                title="Relatórios"
                subtitle="Totais por pessoa e por categoria. O saldo é calculado como Receita – Despesa."
                actions={
                    <div className={styles.headerActions}>
                        <Button
                            variant="ghost"
                            onClick={() => loadAsync.run().catch(() => void 0)}
                            disabled={loadAsync.loading}
                        >
                            {loadAsync.loading ? <Spinner /> : "Recarregar"}
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => window.open(ReportsApi.totalsByPersonPdfUrl(), "_blank")}
                        >
                            PDF Pessoas
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => window.open(ReportsApi.totalsByCategoryPdfUrl(), "_blank")}
                        >
                            PDF Categorias
                        </Button>
                    </div>
                }
            />

            {loadAsync.error && <Alert title="Erro" message={loadAsync.error} variant="error" />}

            <div className={styles.kpis}>
                <Stat
                    label="Receitas"
                    value={formatCurrencyBRL(gt?.totalIncome ?? 0)}
                    hint="Soma de todas as receitas."
                    tone="ok"
                />
                <Stat
                    label="Despesas"
                    value={formatCurrencyBRL(gt?.totalExpense ?? 0)}
                    hint="Soma de todas as despesas."
                    tone="warn"
                />
                <Stat
                    label="Saldo"
                    value={formatCurrencyBRL(gt?.balance ?? 0)}
                    hint="Receitas – Despesas."
                    tone={tone(gt?.balance ?? 0)}
                />
            </div>

            <Card title="Totais por pessoa" description="Somatório de receitas e despesas agrupado por pessoa.">
                <Table headers={["Pessoa", "Receitas", "Despesas", "Saldo"]} rows={personRows} />
            </Card>

            <Card title="Totais por categoria" description="Somatório de receitas e despesas agrupado por categoria.">
                <Table headers={["Categoria", "Receitas", "Despesas", "Saldo"]} rows={categoryRows} />
            </Card>
        </div>
    );
}
