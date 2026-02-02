export type Guid = string;

// Generic paged response used by list endpoints
export type PagedResponse<T> = {
    items: T[];
    totalItems: number;
    page: number;
    pageSize: number;
};

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
    amount: number;
    type: TransactionType;
    personId: Guid;
    personName: string;
    categoryId: Guid;
    categoryDescription: string;
};

// Reports (matches Manager.Application.DTOs.ReportDtos)
export type TotalsRowResponse = {
    id: Guid;
    name: string;
    totalIncome: number;
    totalExpense: number;
    balance: number;
};

export type TotalsReportResponse = PagedResponse<TotalsRowResponse> & {
    grandTotal: TotalsRowResponse;
};
