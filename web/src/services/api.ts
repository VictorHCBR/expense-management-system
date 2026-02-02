import { http } from "./http";
import type {
    CategoryPurpose,
    CategoryResponse,
    Guid,
    PagedResponse,
    PersonResponse,
    TotalsReportResponse,
    TransactionResponse,
    TransactionType
} from "../types/domain";

/**
 * Base URL para a API.
 * - Em Docker: o Nginx do container web faz proxy /api -> api:8080
 * - Em dev (Vite): também usamos /api e deixamos o proxy do Vite/Reverse-proxy cuidar
 */
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "/api";

function qs(params?: Record<string, unknown>): string {
    if (!params) return "";
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null || v === "") continue;
        sp.set(k, String(v));
    }
    const s = sp.toString();
    return s ? `?${s}` : "";
}

export const PeopleApi = {
    list: (p?: { name?: string; minAge?: number; maxAge?: number; page?: number; pageSize?: number }) =>
        http<PagedResponse<PersonResponse>>(`${API_BASE}/people${qs({ page: 1, pageSize: 200, ...p })}`),

    create: (payload: { name: string; age: number }) =>
        http<PersonResponse>(`${API_BASE}/people`, { method: "POST", body: JSON.stringify(payload) }),

    update: (id: Guid, payload: { name: string; age: number }) =>
        http<void>(`${API_BASE}/people/${id}`, { method: "PUT", body: JSON.stringify(payload) }),

    remove: (id: Guid) => http<void>(`${API_BASE}/people/${id}`, { method: "DELETE" })
};

export const CategoriesApi = {
    list: (p?: { description?: string; purpose?: CategoryPurpose; page?: number; pageSize?: number }) =>
        http<PagedResponse<CategoryResponse>>(`${API_BASE}/categories${qs({ page: 1, pageSize: 200, ...p })}`),

    create: (payload: { description: string; purpose: CategoryPurpose }) =>
        http<CategoryResponse>(`${API_BASE}/categories`, { method: "POST", body: JSON.stringify(payload) })
};

export const TransactionsApi = {
    list: (p?: { personId?: Guid; categoryId?: Guid; type?: TransactionType; description?: string; page?: number; pageSize?: number }) =>
        http<PagedResponse<TransactionResponse>>(`${API_BASE}/transactions${qs({ page: 1, pageSize: 200, ...p })}`),

    create: (payload: { description: string; amount: number; type: TransactionType; categoryId: Guid; personId: Guid }) =>
        http<TransactionResponse>(`${API_BASE}/transactions`, { method: "POST", body: JSON.stringify(payload) })
};

export const ReportsApi = {
    totalsByPerson: (p?: { page?: number; pageSize?: number; personName?: string }) =>
        http<TotalsReportResponse>(`${API_BASE}/reports/people${qs({ page: 1, pageSize: 20, ...p })}`),

    totalsByCategory: (p?: { page?: number; pageSize?: number; categoryDescription?: string; purpose?: CategoryPurpose }) =>
        http<TotalsReportResponse>(`${API_BASE}/reports/categories${qs({ page: 1, pageSize: 20, ...p })}`),

    totalsByPersonPdfUrl: (p?: { page?: number; pageSize?: number; personName?: string }) =>
        `${API_BASE}/reports/people/pdf${qs({ page: 1, pageSize: 200, ...p })}`,

    totalsByCategoryPdfUrl: (p?: { page?: number; pageSize?: number; categoryDescription?: string; purpose?: CategoryPurpose }) =>
        `${API_BASE}/reports/categories/pdf${qs({ page: 1, pageSize: 200, ...p })}`
};
