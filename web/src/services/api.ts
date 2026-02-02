import { http } from "./http";
import type {
    CategoryPurpose,
    CategoryResponse,
    Guid,
    PersonResponse,
    TotalsByCategoryResponse,
    TotalsByPersonResponse,
    TransactionResponse,
    TransactionType
} from "../types/domain";

/**
 * Importante: em Docker, o Nginx do container web faz proxy /api -> api:8080,
 * então o frontend chama sempre "/api/...".
 */

export const PeopleApi = {
    list: () => http<PersonResponse[]>("/api/people"),
    create: (payload: { name: string; age: number }) =>
        http<PersonResponse>("/api/people", { method: "POST", body: JSON.stringify(payload) }),
    update: (id: Guid, payload: { name: string; age: number }) =>
        http<PersonResponse>(`/api/people/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (id: Guid) => http<void>(`/api/people/${id}`, { method: "DELETE" })
};

export const CategoriesApi = {
    list: () => http<CategoryResponse[]>("/api/categories"),
    create: (payload: { description: string; purpose: CategoryPurpose }) =>
        http<CategoryResponse>("/api/categories", { method: "POST", body: JSON.stringify(payload) })
};

export const TransactionsApi = {
    list: () => http<TransactionResponse[]>("/api/transactions"),
    create: (payload: { description: string; value: number; type: TransactionType; categoryId: Guid; personId: Guid }) =>
        http<TransactionResponse>("/api/transactions", { method: "POST", body: JSON.stringify(payload) })
};

export const ReportsApi = {
    totalsByPerson: () => http<TotalsByPersonResponse>("/api/reports/totals-by-person"),
    totalsByCategory: () => http<TotalsByCategoryResponse>("/api/reports/totals-by-category")
};
