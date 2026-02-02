import { useMemo, useState } from "react";
import type { TotalsByCategoryResponse, TotalsByPersonResponse } from "../../types/domain";
import { formatCurrencyBRL } from "../../utils/format";
import { PageHeader } from "../../components/ui/PageHeader/PageHeader";
import { Card } from "../../components/ui/Card/Card";
import { Button } from "../../components/ui/Button/Button";
import { Table } from "../../components/ui/Table/Table";
import { Stat } from "../../components/ui/Stat/Stat";
import styles from "./ReportsPage.module.css";

function tone(balance: number): "ok" | "warn" | "neutral" {
    if (balance > 0) return "ok";
    if (balance < 0) return "warn";
    return "neutral";
}

export function ReportsPage() {
    const [byPerson] = useState<TotalsByPersonResponse | null>(null);
    const [byCategory] = useState<TotalsByCategoryResponse | null>(null)

    const personRows = useMemo(() => {
        const items = byPerson?.items ?? [];
        return [...items]
            .sort((a, b) => a.personName.localeCompare(b.personName))
            .map((i) => [
                <div key={i.personId} className={styles.primary}>{i.personName}</div>,
                <span key={i.personId + "-in"} className={styles.moneyOk}>{formatCurrencyBRL(i.totals.totalIncome)}</span>,
                <span key={i.personId + "-ex"} className={styles.moneyWarn}>{formatCurrencyBRL(i.totals.totalExpense)}</span>,
                <span key={i.personId + "-bal"} className={styles.money}>{formatCurrencyBRL(i.totals.balance)}</span>
            ]);
    }, [byPerson]);

    const categoryRows = useMemo(() => {
        const items = byCategory?.items ?? [];
        return [...items]
            .sort((a, b) => a.categoryDescription.localeCompare(b.categoryDescription))
            .map((i) => [
                <div key={i.categoryId} className={styles.primary}>{i.categoryDescription}</div>,
                <span key={i.categoryId + "-in"} className={styles.moneyOk}>{formatCurrencyBRL(i.totals.totalIncome)}</span>,
                <span key={i.categoryId + "-ex"} className={styles.moneyWarn}>{formatCurrencyBRL(i.totals.totalExpense)}</span>,
                <span key={i.categoryId + "-bal"} className={styles.money}>{formatCurrencyBRL(i.totals.balance)}</span>
            ]);
    }, [byCategory]);

    const gt = byPerson?.grandTotal ?? byCategory?.grandTotal ?? null;

    return (
        <div className="stack">
            <PageHeader
                title="Relatórios"
                subtitle="Totais por pessoa e por categoria. O saldo é calculado como Receita – Despesa."
                actions={
                    <Button>
                    </Button>
                }
            />

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
