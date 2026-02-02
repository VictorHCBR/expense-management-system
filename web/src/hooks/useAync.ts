import { useCallback, useState } from "react";

/**
 * Hook para padronizar:
 * - loading
 * - error
 * - execução de funções async (para eu não precisar colocar try/catch
 *   em todos os lugares do código)
 */
export function useAsync<TArgs extends unknown[], TResult>(fn: (...args: TArgs) => Promise<TResult>) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const run = useCallback(
        async (...args: TArgs) => {
            setLoading(true);
            setError(null);
            try {
                return await fn(...args);
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Erro inesperado.";
                setError(msg);
                throw e;
            } finally {
                setLoading(false);
            }
        },
        [fn]
    );

    return { run, loading, error, setError };
}
