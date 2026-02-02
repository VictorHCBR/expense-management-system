import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card/Card";
import { PageHeader } from "../../components/ui/PageHeader/PageHeader";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
    return (
        <div className="stack">
            <PageHeader
                title="Visão geral"
                subtitle="Cadastre pessoas, categorias e transações. Em seguida, consulte os totais por pessoa e por categoria."
            />

            <div className={styles.grid}>
                <Card
                    title="Pessoas"
                    description="CRUD completo (criar, editar, remover, listar). Ao remover, as transações são apagadas pelo banco (cascade)."
                    actions={<Link className={styles.link} to="/people">Abrir</Link>}
                >
                    <p className={styles.text}>
                        Regras: nome obrigatório (máx 200), idade não-negativa.
                    </p>
                </Card>

                <Card
                    title="Categorias"
                    description="Criação e listagem. A finalidade controla em quais tipos de transação a categoria pode ser usada."
                    actions={<Link className={styles.link} to="/categories">Abrir</Link>}
                >
                    <p className={styles.text}>
                        Finalidade: Despesa / Receita / Ambas (máx 400 caracteres na descrição).
                    </p>
                </Card>

                <Card
                    title="Transações"
                    description="Criação e listagem. Regras: valor positivo; menor de 18 anos só aceita despesas; categoria deve ser compatível com o tipo."
                    actions={<Link className={styles.link} to="/transactions">Abrir</Link>}
                >
                    <p className={styles.text}>
                        Dica: o formulário já filtra categorias compatíveis com o tipo selecionado.
                    </p>
                </Card>

                <Card
                    title="Relatórios"
                    description="Totais por pessoa e por categoria (opcional). Exibe receitas, despesas e saldo (receita – despesa), com total geral."
                    actions={<Link className={styles.link} to="/reports">Abrir</Link>}
                >
                    <p className={styles.text}>
                        Ideal para validar rapidamente se as regras estão funcionando.
                    </p>
                </Card>
            </div>
        </div>
    );
}
