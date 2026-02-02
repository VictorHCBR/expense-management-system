import { useMemo, useState } from "react";
import type { Guid, PersonResponse } from "../../types/domain";
import type { FieldErrors } from "../../utils/validation";
import { PageHeader } from "../../components/ui/PageHeader/PageHeader";
import { Card } from "../../components/ui/Card/Card";
import { Input } from "../../components/ui/Input/Input";
import { Button } from "../../components/ui/Button/Button";
import { Table } from "../../components/ui/Table/Table";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog/ConfirmDialog";
import styles from "./PeoplePage.module.css";

type CreateFields = "name" | "age";

export function PeoplePage() {
    const [people] = useState<PersonResponse[]>([]);
    const [createName, setCreateName] = useState("");
    const [createAge, setCreateAge] = useState<number>(0);
    const [createErrors, setCreateErrors] = useState<FieldErrors<CreateFields>>({});

    const [editing, setEditing] = useState<PersonResponse | null>(null);
    const [editName, setEditName] = useState("");
    const [editAge, setEditAge] = useState<number>(0);
    const [editErrors, setEditErrors] = useState<FieldErrors<CreateFields>>({});

    const [deleteId, setDeleteId] = useState<Guid | null>(null);

    const rows = useMemo(() => {
        return people.map((p) => [
            <div className={styles.nameCell} key={p.id}>
                <div className={styles.name}>{p.name}</div>
                <div className={styles.sub}>ID: {p.id}</div>
            </div>,
            <span key={p.id + "-age"}>{p.age}</span>,
            <div className={styles.actions} key={p.id + "-actions"}>
                <Button
                    variant="ghost"
                    onClick={() => {
                        setEditing(p);
                        setEditName(p.name);
                        setEditAge(p.age);
                        setEditErrors({});
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                >
                    Editar
                </Button>
                <Button variant="danger" onClick={() => setDeleteId(p.id)}>
                    Excluir
                </Button>
            </div>
        ]);
    }, [people]);

    return (
        <div className="stack">
            <PageHeader title="Pessoas" subtitle="CRUD completo. Ao excluir uma pessoa, as transações são removidas automaticamente (cascade no banco)." />

            {editing && (
                <Card
                    title="Editar pessoa"
                    description="Atualiza nome e idade. Regras: nome obrigatório (máx 200) e idade não-negativa."
                    actions={
                        <Button variant="ghost" onClick={() => setEditing(null)}>
                            Cancelar
                        </Button>
                    }
                >
                    <div className="grid2">
                        <Input
                            label="Nome"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            maxLength={200}
                            error={editErrors.name}
                            placeholder="Ex.: João da Silva"
                        />
                        <Input
                            label="Idade"
                            type="number"
                            value={String(editAge)}
                            onChange={(e) => setEditAge(Number(e.target.value))}
                            min={0}
                            error={editErrors.age}
                        />
                    </div>
                </Card>
            )}

            <Card title="Criar pessoa" description="Preencha os dados e clique em Criar.">
                <div className="grid2">
                    <Input
                        label="Nome"
                        value={createName}
                        onChange={(e) => setCreateName(e.target.value)}
                        maxLength={200}
                        error={createErrors.name}
                        placeholder="Ex.: Maria"
                    />
                    <Input
                        label="Idade"
                        type="number"
                        value={String(createAge)}
                        onChange={(e) => setCreateAge(Number(e.target.value))}
                        min={0}
                        error={createErrors.age}
                    />
                </div>

                <div className={styles.formActions}>
                    <Button>
                    </Button>
                    <Button variant="ghost" onClick={() => { setCreateName(""); setCreateAge(0); setCreateErrors({}); }}>
                        Limpar
                    </Button>
                </div>
            </Card>

            <Card
                title="Lista"
                description="Lista ordenada por nome."
            >
                <Table headers={["Pessoa", "Idade", "Ações"]} rows={rows} />
            </Card>

            <ConfirmDialog
                open={deleteId !== null}
                title="Excluir pessoa?"
                message="Isso irá remover a pessoa e também todas as transações associadas."
                confirmText="Excluir"
                onConfirm={() => setDeleteId(null)}
                onClose={() => setDeleteId(null)}
            />
        </div>
    );
}
