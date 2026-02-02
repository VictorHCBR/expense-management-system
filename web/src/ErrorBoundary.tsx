import React from "react";

type Props = { children: React.ReactNode };
type State = { error: Error | null };

/**
 * Evita "tela preta" em build de produção quando algum componente lança exceção.
 * Em vez disso, mostra a mensagem e orienta a checar o console.
 */
export class ErrorBoundary extends React.Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error) {
        // eslint-disable-next-line no-console
        console.error("UI crash caught by ErrorBoundary:", error);
    }

    render() {
        if (!this.state.error) return this.props.children;

        return (
            <div style={{ padding: 24, color: "#fff" }}>
                <h2 style={{ marginTop: 0 }}>Opa — algo quebrou na UI.</h2>
                <p style={{ opacity: 0.9 }}>
                    Abra o DevTools (F12) → Console para ver o erro completo.
                </p>
                <pre style={{ whiteSpace: "pre-wrap", background: "rgba(255,255,255,0.08)", padding: 16, borderRadius: 12 }}>
                    {String(this.state.error.message || this.state.error)}
                </pre>
            </div>
        );
    }
}
