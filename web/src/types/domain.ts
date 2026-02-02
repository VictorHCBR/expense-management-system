export type Guid = string;

export enum CategoryPurpose {
    Expense = 1,
    Income = 2,
    Both = 3
}

export enum TransactionType {
    Expense = 1,
    Income = 2
}

export type PersonResponse = {
    id: Guid;
    name: string;
    age: number;
};

export type CategoryResponse = {
    id: Guid;
    description: string;
    purpose: CategoryPurpose;
};

export type TransactionResponse = {
    id: Guid;
    description: string;
    value: number;
    type: TransactionType;
    categoryId: Guid;
    personId: Guid;
    createdAtUtc: string;
};

export type Totals = {
    totalIncome: number;
    totalExpense: number;
    balance: number;
};

export type PersonTotals = {
    personId: Guid;
    personName: string;
    totals: Totals;
};

export type CategoryTotals = {
    categoryId: Guid;
    categoryDescription: string;
    totals: Totals;
};

export type TotalsByPersonResponse = {
    items: PersonTotals[];
    grandTotal: Totals;
};

export type TotalsByCategoryResponse = {
    items: CategoryTotals[];
    grandTotal: Totals;
};
