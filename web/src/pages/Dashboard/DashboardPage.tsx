import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card/Card";
import { PageHeader } from "../../components/ui/PageHeader/PageHeader";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
    return (
        <div className="stack">
            <PageHeader
                title="Visão geral"
                subtitle="Aproveite o poder. Crie pessoas, categorias e gerencie seus gastos!"
            />

            <div className={styles.grid}>
                <Card
                    title="Pessoas"
                    description="Crie Pessoas com suas informações! Cuidado ao deletar hein! 🤷‍♂️"
                    actions={<Link className={styles.link} to="/people">Abrir</Link>}
                >
                    <p className={styles.text}>
                        Regras: Nome obrigatório (máx 200), Idade não-negativa.
                    </p>
                </Card>

                <Card
                    title="Categorias"
                    description="Criação e listagem.
                        A finalidade controla em quais tipos de transação a categoria pode ser usada."
                    actions={<Link className={styles.link} to="/categories">Abrir</Link>}
                >
                    <p className={styles.text}>
                        Finalidade: Despesa / Receita / Ambas (máx 400 caracteres na descrição).
                    </p>
                </Card>

                <Card
                    title="Transações"
                    description="Crie e veja as suas transações em casa. 🤯
                        Regras: Valor positivo;
                        Menores de 18 anos apenas registram despesas;
                        A categoria deve ser compatível com o tipo."
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
                        Você consegue ver os gastos!
                    </p>
                </Card>
            </div>
        </div>
    );
}
