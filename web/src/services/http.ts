type ApiProblem = { title?: string; detail?: string; status?: number };

/**
 * Wrapper do fetch:
 * - padroniza headers JSON
 * - interpreta ProblemDetails (ASP.NET) para gerar mensagens legíveis
 */
async function parseError(res: Response): Promise<string> {
    try {
        const data = (await res.json()) as ApiProblem;
        return data.detail || data.title || `Erro HTTP ${res.status}`;
    } catch {
        return `Erro HTTP ${res.status}`;
    }
}

export async function http<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {})
        }
    });

    if (!res.ok) {
        throw new Error(await parseError(res));
    }

    if (res.status === 204) return undefined as unknown as T;
    return (await res.json()) as T;
}
