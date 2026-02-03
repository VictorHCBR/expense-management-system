import { useEffect, useMemo, useState } from "react";
import type { CategoryResponse, PersonResponse, TransactionResponse } from "../../types/domain";
import { CategoryPurpose, TransactionType } from "../../types/domain";
import { CategoriesApi, PeopleApi, TransactionsApi } from "../../services/api";
import { useAsync } from "../../hooks/useAync";
import { formatCurrencyBRL } from "../../utils/format";
import { purposeLabel, transactionTypeLabel } from "../../utils/labels";
import type { FieldErrors } from "../../utils/validation";
import { nonEmpty, maxLen } from "../../utils/validation";
import { PageHeader } from "../../components/ui/PageHeader/PageHeader";
import { Card } from "../../components/ui/Card/Card";
import { Input } from "../../components/ui/Input/Input";
import { Select } from "../../components/ui/Select/Select";
import { Badge } from "../../components/ui/Badge/Badge";
import { Button } from "../../components/ui/Button/Button";
import { Table } from "../../components/ui/Table/Table";
import { Alert } from "../../components/ui/Alert/Alert";
import { Spinner } from "../../components/ui/Spinner/Spinner";
import styles from "./TransactionsPage.module.css";

type CreateFields = "description" | "amount" | "type" | "categoryId" | "personId";

function compatibleCategory(purpose: CategoryPurpose, type: TransactionType): boolean {
    if (purpose === CategoryPurpose.Both) return true;
    if (purpose === CategoryPurpose.Expense && type === TransactionType.Expense) return true;
    if (purpose === CategoryPurpose.Income && type === TransactionType.Income) return true;
    return false;
}

export function TransactionsPage() {
    const [people, setPeople] = useState<PersonResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [type, setType] = useState<TransactionType>(TransactionType.Expense);
    const [personId, setPersonId] = useState<string>("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [errors, setErrors] = useState<FieldErrors<CreateFields>>({});

    const loadLookupsAsync = useAsync(async () => {
        const [p, c] = await Promise.all([PeopleApi.list(), CategoriesApi.list()]);
        setPeople(p.items);
        setCategories(c.items);
    });

    const listAsync = useAsync(async () => {
        const data = await TransactionsApi.list();
        setTransactions(data.items);
    });

    const createAsync = useAsync(async () => {
        const created = await TransactionsApi.create({ description, amount, type, categoryId, personId });
        setTransactions((prev) => [created, ...prev]);
        setDescription("");
        setAmount(0);
    });

    useEffect(() => {
        loadLookupsAsync.run().catch(() => void 0);
        listAsync.run().catch(() => void 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const rows = useMemo(() => {
        return transactions.map((t) => {
            const badgeVariant = t.type === TransactionType.Income ? "ok" : "warn";

            return [
                <div className={styles.txCell} key={t.id}>
                    <div className={styles.txTitle}>{t.description}</div>
                </div>,
                <Badge key={t.id + "-type"} text={transactionTypeLabel(t.type)} variant={badgeVariant} />,
                <span key={t.id + "-amount"} className={styles.value}>{formatCurrencyBRL(t.amount)}</span>,
                <div className={styles.subCell} key={t.id + "-person"}>
                    <div className={styles.primary}>{t.personName}</div>
                </div>,
                <div className={styles.subCell} key={t.id + "-category"}>
                    <div className={styles.primary}>{t.categoryDescription}</div>
                    <div className={styles.sub}>{purposeLabel(categories.find(c => c.id === t.categoryId)?.purpose ?? CategoryPurpose.Both)}</div>
                </div>
            ];
        });
    }, [transactions, categories]);

    function validate(): FieldErrors<CreateFields> {
        const e: FieldErrors<CreateFields> = {};
        if (!nonEmpty(description)) e.description = "Descrição é obrigatória.";
        else if (!maxLen(description, 400)) e.description = "Descrição deve ter no máximo 400 caracteres.";

        if (!Number.isFinite(amount) || amount <= 0) e.amount = "Valor deve ser maior que 0.";

        if (![TransactionType.Expense, TransactionType.Income].includes(type)) e.type = "Tipo inválido.";

        if (!personId) e.personId = "Selecione uma pessoa.";
        if (!categoryId) e.categoryId = "Selecione uma categoria.";

        const cat = categories.find((c) => c.id === categoryId);
        if (cat && !compatibleCategory(cat.purpose, type)) e.categoryId = "Categoria incompatível com o tipo.";

        if (isMinor && type === TransactionType.Income) e.type = "Menor de idade não pode registrar receitas.";

        return e;
    }

    function submit() {
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length > 0) return;
        createAsync.run().catch(() => void 0);
    }

    return (
        <div className="stack">
            <PageHeader
                title="Transações"
                subtitle="Crie e liste despesas/receitas. Regras: valor positivo; menor de 18 anos só aceita despesas; categoria precisa ser compatível."
                actions={
                    <Button variant="ghost" onClick={() => listAsync.run().catch(() => void 0)} disabled={listAsync.loading}>
                        {listAsync.loading ? <Spinner /> : "Recarregar"}
                    </Button>
                }
            />

            {(loadLookupsAsync.error || listAsync.error || createAsync.error) && (
                <Alert
                    title="Erro"
                    message={loadLookupsAsync.error || listAsync.error || createAsync.error || "Erro"}
                    variant="error"
                />
            )}

            {isMinor && (
                <Alert
                    title="Regra aplicada"
                    message="A pessoa selecionada é menor de 18 anos — o tipo foi fixado como Despesa (receitas não são aceitas)."
                />
            )}

            <Card title="Criar transação" description="Escolha pessoa, tipo, categoria e informe descrição e valor.">
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
                        value={String(amount)}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        min={0}
                        step="0.01"
                        error={errors.amount}
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
                    <Button onClick={submit} disabled={createAsync.loading}>
                        {createAsync.loading ? <Spinner /> : "Criar"}
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setDescription("");
                            setAmount(0);
                            setErrors({});
                        }}
                    >
                        Limpar
                    </Button>
                </div>
            </Card>

            <Card title="Lista" description="Transações mais recentes primeiro.">
                <Table headers={["Descrição", "Tipo", "Valor", "Pessoa", "Categoria"]} rows={rows} />
            </Card>
        </div>
    );
}
