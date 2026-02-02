export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export function nonEmpty(text: string): boolean {
    return text.trim().length > 0;
}

export function maxLen(text: string, max: number): boolean {
    return text.trim().length <= max;
}

export function positiveNumber(n: number): boolean {
    return Number.isFinite(n) && n > 0;
}
