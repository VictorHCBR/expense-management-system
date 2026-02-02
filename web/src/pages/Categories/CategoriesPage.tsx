import { PageHeader } from "../../components/ui/PageHeader/PageHeader";
import { Card } from "../../components/ui/Card/Card";
import { Input } from "../../components/ui/Input/Input";
import { Select } from "../../components/ui/Select/Select";
import { Badge } from "../../components/ui/Badge/Badge";
import { Button } from "../../components/ui/Button/Button";
import { Table } from "../../components/ui/Table/Table";
import styles from "./CategoriasPage.module.css";
import { CategoryPurpose, type CategoryResponse } from "../../types/domain";
import { useMemo, useState } from "react";
import { type FieldErrors } from "../../utils/validation";
import { purposeLabel } from "../../utils/labels";

type CreateFields = "description" | "purpose";

export function CategoriesPage() {
    const [categories] = useState<CategoryResponse[]>([]);
    const [description, setDescription] = useState("");
    const [purpose, setPurpose] = useState<CategoryPurpose>(CategoryPurpose.Expense);
    const [errors, setErrors] = useState<FieldErrors<CreateFields>>({});

    const rows = useMemo(
        () => {
            return categories.map((cat) => [
                <div className={styles.descCell} key={cat.id}>
                    <div className={styles.desc}>{cat.description}</div>
                    <div className={styles.sub}>ID: {cat.id}</div>
                </div>,
                <Badge
                    key={cat.id + "-badge"}
                    text={purposeLabel(cat.purpose)}
                    variant={cat.purpose === CategoryPurpose.Both ? "ok" : "neutral"}
                />,
                <span className={styles.muted} key={cat.id + "-hint"}>
                    {
                        cat.purpose === CategoryPurpose.Both ?
                            "Pode ser usada em despesas e receitas" :
                            cat.purpose === CategoryPurpose.Expense ?
                                "Somente despesas" :
                                "Somente receitas"
                    }
                </span>
            ]);
        }, [categories]);

    return (
        <div className="stack">
            <PageHeader title="Categorias" subtitle="Criação e istagem. A finalidade controla a
            compatibilidade com despesa/receita"/>

            <Card
                title="Criar categoria"
                description="Descrição (máximo 400 caracteres) e finalidade
                            (despesa/receita/ambas)">
                <div className="grid2">
                    <Input
                        label="Descrição"
                        value={description}
                        onChange={(ev) => setDescription(ev.target.value)}
                        maxLength={400}
                        error={errors.description}
                        placeholder="Ex.: Mercado/Salário/Aluguel"
                    />
                    <Select
                        label="Finalidade"
                        value={purpose}
                        onChange={(ev) => setPurpose(Number(ev.target.value) as CategoryPurpose)}
                        error={errors.purpose}
                        options={[
                            { value: CategoryPurpose.Expense, label: "Despesa" },
                            { value: CategoryPurpose.Income, label: "Receita" },
                            { value: CategoryPurpose.Both, label: "Ambas" }
                        ]}
                    />
                </div>

                <div className={styles.formActions}>
                    <Button onClick={() => {
                        setDescription("");
                        setPurpose(CategoryPurpose.Expense);
                        setErrors({})
                    }}>
                        Limpar
                    </Button>
                </div>
            </Card>

            <Card
                title="Lista"
                description="Ordenada por descrição"
                actions={
                    <Button>
                        {/* ainda preciso implementar os comportamentos da API, por enquanto somente a estrutura da página */}
                    </Button>
                }
            >
                <Table headers={["Categoria", "Finalidade", "Observação"]} rows={rows} />
            </Card>
        </div>
    );
}