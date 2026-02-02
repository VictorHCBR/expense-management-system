import { useEffect, useMemo, useState } from "react";
import { PeopleApi } from "../../services/api";
import { useAsync } from "../../hooks/useAync";
import type { PersonResponse, Guid } from "../../types/domain";
import { nonEmpty, maxLen } from "../../utils/validation";
import type { FieldErrors } from "../../utils/validation";
import { PageHeader } from "../../components/ui/PageHeader/PageHeader";
import { Card } from "../../components/ui/Card/Card";
import { Input } from "../../components/ui/Input/Input";
import { Button } from "../../components/ui/Button/Button";
import { Table } from "../../components/ui/Table/Table";
import { Alert } from "../../components/ui/Alert/Alert";
import { Spinner } from "../../components/ui/Spinner/Spinner";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog/ConfirmDialog";
import styles from "./PeoplePage.module.css";

type CreateFields = "name" | "age";

export function PeoplePage() {
    const [people, setPeople] = useState<PersonResponse[]>([]);
    const [createName, setCreateName] = useState("");
    const [createAge, setCreateAge] = useState<number>(0);
    const [createErrors, setCreateErrors] = useState<FieldErrors<CreateFields>>({});

    const [editing, setEditing] = useState<PersonResponse | null>(null);
    const [editName, setEditName] = useState("");
    const [editAge, setEditAge] = useState<number>(0);
    const [editErrors, setEditErrors] = useState<FieldErrors<CreateFields>>({});

    const [deleteId, setDeleteId] = useState<Guid | null>(null);

    const listAsync = useAsync(async () => {
        const data = await PeopleApi.list();
        setPeople(data);
    });

    const createAsync = useAsync(async () => {
        const created = await PeopleApi.create({ name: createName, age: createAge });
        setPeople((prev) => [created, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
        setCreateName("");
        setCreateAge(0);
    });

    const updateAsync = useAsync(async () => {
        if (!editing) return;
        const updated = await PeopleApi.update(editing.id, { name: editName, age: editAge });
        setPeople((prev) => prev.map((p) => (p.id === updated.id ? updated : p)).sort((a, b) => a.name.localeCompare(b.name)));
        setEditing(null);
    });

    const deleteAsync = useAsync(async () => {
        if (!deleteId) return;
        await PeopleApi.remove(deleteId);
        setPeople((prev) => prev.filter((p) => p.id !== deleteId));
    });

    useEffect(() => {
        listAsync.run().catch(() => void 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    function validate(name: string, age: number): FieldErrors<CreateFields> {
        const e: FieldErrors<CreateFields> = {};
        if (!nonEmpty(name)) e.name = "Nome é obrigatório.";
        else if (!maxLen(name, 200)) e.name = "Nome deve ter no máximo 200 caracteres.";

        if (!Number.isFinite(age) || age < 0) e.age = "Idade deve ser um número >= 0.";
        return e;
    }

    function submitCreate() {
        const e = validate(createName, createAge);
        setCreateErrors(e);
        if (Object.keys(e).length > 0) return;

        createAsync.run().catch(() => void 0);
    }

    function submitEdit() {
        const e = validate(editName, editAge);
        setEditErrors(e);
        if (Object.keys(e).length > 0) return;

        updateAsync.run().catch(() => void 0);
    }

    return (
        <div className="stack">
            <PageHeader title="Pessoas" subtitle="CRUD completo. Ao excluir uma pessoa, as transações são removidas automaticamente (cascade no banco)." />

            {(listAsync.error || createAsync.error || updateAsync.error || deleteAsync.error) && (
                <Alert title="Erro" message={listAsync.error || createAsync.error || updateAsync.error || deleteAsync.error || "Erro"} variant="error" />
            )}

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

                    <div className={styles.formActions}>
                        <Button onClick={submitEdit} disabled={updateAsync.loading}>
                            {updateAsync.loading ? <Spinner /> : "Salvar"}
                        </Button>
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
                    <Button onClick={submitCreate} disabled={createAsync.loading}>
                        {createAsync.loading ? <Spinner /> : "Criar"}
                    </Button>
                    <Button variant="ghost" onClick={() => { setCreateName(""); setCreateAge(0); setCreateErrors({}); }}>
                        Limpar
                    </Button>
                </div>
            </Card>

            <Card
                title="Lista"
                description="Lista ordenada por nome."
                actions={
                    <Button variant="ghost" onClick={() => listAsync.run().catch(() => void 0)} disabled={listAsync.loading}>
                        {listAsync.loading ? <Spinner /> : "Recarregar"}
                    </Button>
                }
            >
                <Table headers={["Pessoa", "Idade", "Ações"]} rows={rows} />
            </Card>

            <ConfirmDialog
                open={deleteId !== null}
                title="Excluir pessoa?"
                message="Isso irá remover a pessoa e também todas as transações associadas."
                confirmText="Excluir"
                onConfirm={() => deleteAsync.run().catch(() => void 0)}
                onClose={() => setDeleteId(null)}
            />
        </div>
    );
}
