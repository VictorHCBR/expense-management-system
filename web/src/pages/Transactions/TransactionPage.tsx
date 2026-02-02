import { useEffect, useMemo, useState } from "react";
import type { CategoryResponse, PersonResponse, TransactionResponse } from "../../types/domain";
import { CategoryPurpose, TransactionType } from "../../types/domain";
import { formatCurrencyBRL, formatDateTime } from "../../utils/format";
import { purposeLabel, transactionTypeLabel } from "../../utils/labels";
import type { FieldErrors } from "../../utils/validation";
import { PageHeader } from "../../components/ui/PageHeader/PageHeader";
import { Card } from "../../components/ui/Card/Card";
import { Input } from "../../components/ui/Input/Input";
import { Select } from "../../components/ui/Select/Select";
import { Badge } from "../../components/ui/Badge/Badge";
import { Button } from "../../components/ui/Button/Button";
import { Table } from "../../components/ui/Table/Table";
import { Alert } from "../../components/ui/Alert/Alert";
import styles from "./TransactionsPage.module.css";

type CreateFields = "description" | "value" | "type" | "categoryId" | "personId";

function compatibleCategory(purpose: CategoryPurpose, type: TransactionType): boolean {
    if (purpose === CategoryPurpose.Both) return true;
    if (purpose === CategoryPurpose.Expense && type === TransactionType.Expense) return true;
    if (purpose === CategoryPurpose.Income && type === TransactionType.Income) return true;
    return false;
}

export function TransactionsPage() {
    const [people] = useState<PersonResponse[]>([]);
    const [categories] = useState<CategoryResponse[]>([]);
    const [transactions] = useState<TransactionResponse[]>([]);

    const [description, setDescription] = useState("");
    const [value, setValue] = useState<number>(0);
    const [type, setType] = useState<TransactionType>(TransactionType.Expense);
    const [personId, setPersonId] = useState<string>("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [errors, setErrors] = useState<FieldErrors<CreateFields>>({});

    const selectedPerson = useMemo(() => people.find((p) => p.id === personId) ?? null, [people, personId]);
    const isMinor = (selectedPerson?.age ?? 18) < 18;

    // Regra de UX: se menor, força despesa
    useEffect(() => {
        if (isMinor) setType(TransactionType.Expense);
    }, [isMinor]);

    const compatibleCategories = useMemo(
        () => categories.filter((c) => compatibleCategory(c.purpose, type)),
        [categories, type]
    );

    // Se o usuário trocar o tipo e a categoria atual ficar incompatível, limpa seleção
    useEffect(() => {
        if (!categoryId) return;
        const exists = categories.some((c) => c.id === categoryId && compatibleCategory(c.purpose, type));
        if (!exists) setCategoryId("");
    }, [type, categoryId, categories]);

    const peopleOptions = useMemo(
        () => [{ value: "", label: "Selecione..." }, ...people.map((p) => ({ value: p.id, label: `${p.name} (${p.age})` }))],
        [people]
    );

    const categoryOptions = useMemo(
        () => [
            { value: "", label: "Selecione..." },
            ...compatibleCategories.map((c) => ({ value: c.id, label: `${c.description} (${purposeLabel(c.purpose)})` }))
        ],
        [compatibleCategories]
    );

    const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
    const personById = useMemo(() => new Map(people.map((p) => [p.id, p])), [people]);

    const rows = useMemo(() => {
        return transactions.map((t) => {
            const p = personById.get(t.personId);
            const c = categoryById.get(t.categoryId);

            const badgeVariant = t.type === TransactionType.Income ? "ok" : "warn";

            return [
                <div className={styles.txCell} key={t.id}>
                    <div className={styles.txTitle}>{t.description}</div>
                    <div className={styles.sub}>ID: {t.id}</div>
                </div>,
                <Badge key={t.id + "-type"} text={transactionTypeLabel(t.type)} variant={badgeVariant} />,
                <span key={t.id + "-value"} className={styles.value}>{formatCurrencyBRL(t.value)}</span>,
                <div className={styles.subCell} key={t.id + "-person"}>
                    <div className={styles.primary}>{p ? p.name : t.personId}</div>
                    <div className={styles.sub}>{p ? `Idade: ${p.age}` : "Pessoa não carregada"}</div>
                </div>,
                <div className={styles.subCell} key={t.id + "-category"}>
                    <div className={styles.primary}>{c ? c.description : t.categoryId}</div>
                    <div className={styles.sub}>{c ? purposeLabel(c.purpose) : "Categoria não carregada"}</div>
                </div>,
                <span key={t.id + "-date"} className={styles.muted}>{formatDateTime(t.createdAtUtc)}</span>
            ];
        });
    }, [transactions, personById, categoryById]);

    return (
        <div className="stack">
            <PageHeader
                title="Transações"
                subtitle="Crie e liste despesas/receitas. Regras: valor positivo; menor de idade só aceita despesas; categoria precisa ser compatível."
            />

            {isMinor && (
                <Alert
                    title="Regra aplicada"
                    message="A pessoa selecionada é menor de 18 anos — o tipo foi fixado como Despesa (receitas não são aceitas)."
                />
            )}

            <Card
                title="Criar transação"
                description="Escolha pessoa, tipo, categoria e informe descrição e valor."
                actions={
                    <Button>
                    </Button>
                }
            >
                <div className="grid2">
                    <Select
                        label="Pessoa"
                        value={personId}
                        onChange={(e) => setPersonId(e.target.value)}
                        options={peopleOptions}
                        error={errors.personId}
                    />

                    <Select
                        label="Tipo"
                        value={type}
                        onChange={(e) => setType(Number(e.target.value) as TransactionType)}
                        options={[
                            { value: TransactionType.Expense, label: "Despesa", disabled: false },
                            { value: TransactionType.Income, label: "Receita", disabled: isMinor }
                        ]}
                        error={errors.type}
                        disabled={isMinor}
                    />

                    <Select
                        label="Categoria (filtrada por compatibilidade)"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        options={categoryOptions}
                        error={errors.categoryId}
                    />

                    <Input
                        label="Valor"
                        type="number"
                        value={String(value)}
                        onChange={(e) => setValue(Number(e.target.value))}
                        min={0}
                        step="0.01"
                        error={errors.value}
                    />

                    <div className={styles.full}>
                        <Input
                            label="Descrição"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={400}
                            error={errors.description}
                            placeholder="Ex.: Aluguel / Supermercado / Salário"
                        />
                    </div>
                </div>

                <div className={styles.formActions}>
                    <Button>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setDescription("");
                            setValue(0);
                            setErrors({});
                        }}
                    >
                        Limpar
                    </Button>
                </div>
            </Card>

            <Card title="Lista" description="Transações mais recentes primeiro.">
                <Table headers={["Descrição", "Tipo", "Valor", "Pessoa", "Categoria", "Data/Hora"]} rows={rows} />
            </Card>
        </div>
    );
}
