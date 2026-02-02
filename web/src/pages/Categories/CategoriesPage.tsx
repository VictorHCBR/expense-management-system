import { useEffect, useMemo, useState } from "react";
import { CategoriesApi } from "../../services/api";
import { useAsync } from "../../hooks/useAync";
import type { CategoryResponse } from "../../types/domain";
import { CategoryPurpose } from "../../types/domain";
import { nonEmpty, maxLen } from "../../utils/validation";
import type { FieldErrors } from "../../utils/validation";
import { purposeLabel } from "../../utils/labels";
import { PageHeader } from "../../components/ui/PageHeader/PageHeader";
import { Card } from "../../components/ui/Card/Card";
import { Input } from "../../components/ui/Input/Input";
import { Select } from "../../components/ui/Select/Select";
import { Badge } from "../../components/ui/Badge/Badge";
import { Button } from "../../components/ui/Button/Button";
import { Table } from "../../components/ui/Table/Table";
import { Alert } from "../../components/ui/Alert/Alert";
import { Spinner } from "../../components/ui/Spinner/Spinner";
import styles from "./CategoriesPage.module.css";

type CreateFields = "description" | "purpose";

export function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [description, setDescription] = useState("");
    const [purpose, setPurpose] = useState<CategoryPurpose>(CategoryPurpose.Expense);
    const [errors, setErrors] = useState<FieldErrors<CreateFields>>({});

    const listAsync = useAsync(async () => {
        const data = await CategoriesApi.list();
        setCategories(data.items);
    });

    const createAsync = useAsync(async () => {
        const created = await CategoriesApi.create({ description, purpose });
        setCategories((prev) => [created, ...prev].sort((a, b) => a.description.localeCompare(b.description)));
        setDescription("");
        setPurpose(CategoryPurpose.Expense);
    });

    useEffect(() => {
        listAsync.run().catch(() => void 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function validate(): FieldErrors<CreateFields> {
        const e: FieldErrors<CreateFields> = {};
        if (!nonEmpty(description)) e.description = "Descrição é obrigatória.";
        else if (!maxLen(description, 400)) e.description = "Descrição deve ter no máximo 400 caracteres.";
        if (![CategoryPurpose.Expense, CategoryPurpose.Income, CategoryPurpose.Both].includes(purpose)) e.purpose = "Finalidade inválida.";
        return e;
    }

    function submit() {
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length > 0) return;
        createAsync.run().catch(() => void 0);
    }

    const rows = useMemo(() => {
        return categories.map((c) => [
            <div className={styles.descCell} key={c.id}>
                <div className={styles.desc}>{c.description}</div>
                <div className={styles.sub}>ID: {c.id}</div>
            </div>,
            <Badge
                key={c.id + "-badge"}
                text={purposeLabel(c.purpose)}
                variant={c.purpose === CategoryPurpose.Both ? "ok" : "neutral"}
            />,
            <span className={styles.muted} key={c.id + "-hint"}>
                {c.purpose === CategoryPurpose.Both
                    ? "Pode ser usada em despesas e receitas"
                    : c.purpose === CategoryPurpose.Expense
                        ? "Somente despesas"
                        : "Somente receitas"}
            </span>
        ]);
    }, [categories]);

    return (
        <div className="stack">
            <PageHeader title="Categorias" subtitle="Criação e listagem. A finalidade controla a compatibilidade com despesa/receita." />

            {(listAsync.error || createAsync.error) && (
                <Alert title="Erro" message={listAsync.error || createAsync.error || "Erro"} variant="error" />
            )}

            <Card title="Criar categoria" description="Descrição (máx 400) e finalidade (despesa/receita/ambas).">
                <div className="grid2">
                    <Input
                        label="Descrição"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={400}
                        error={errors.description}
                        placeholder="Ex.: Mercado / Salário / Aluguel"
                    />

                    <Select
                        label="Finalidade"
                        value={purpose}
                        onChange={(e) => setPurpose(Number(e.target.value) as CategoryPurpose)}
                        error={errors.purpose}
                        options={[
                            { value: CategoryPurpose.Expense, label: "Despesa" },
                            { value: CategoryPurpose.Income, label: "Receita" },
                            { value: CategoryPurpose.Both, label: "Ambas" }
                        ]}
                    />
                </div>

                <div className={styles.formActions}>
                    <Button onClick={submit} disabled={createAsync.loading}>
                        {createAsync.loading ? <Spinner /> : "Criar"}
                    </Button>
                    <Button variant="ghost" onClick={() => { setDescription(""); setPurpose(CategoryPurpose.Expense); setErrors({}); }}>
                        Limpar
                    </Button>
                </div>
            </Card>

            <Card
                title="Lista"
                description="Ordenada por descrição."
                actions={
                    <Button variant="ghost" onClick={() => listAsync.run().catch(() => void 0)} disabled={listAsync.loading}>
                        {listAsync.loading ? <Spinner /> : "Recarregar"}
                    </Button>
                }
            >
                <Table headers={["Categoria", "Finalidade", "Observação"]} rows={rows} />
            </Card>
        </div>
    );
}
