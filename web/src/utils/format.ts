export function formatCurrencyBRL(value: number): string {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function formatDateTime(isoUtc: string): string {
    const d = new Date(isoUtc);
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(d);
}

export function clampNumber(n: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, n));
}
