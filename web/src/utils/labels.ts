import { CategoryPurpose, TransactionType } from "../types/domain";

export function purposeLabel(p: CategoryPurpose): string {
    switch (p) {
        case CategoryPurpose.Expense: return "Despesa";
        case CategoryPurpose.Income: return "Receita";
        case CategoryPurpose.Both: return "Ambas";
    }
}

export function transactionTypeLabel(t: TransactionType): string {
    switch (t) {
        case TransactionType.Expense: return "Despesa";
        case TransactionType.Income: return "Receita";
    }
}
