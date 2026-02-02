import { useEffect } from "react";
import styles from "./ConfirmDialog.module.css";
import { Button } from "../Button/Button";

type Props = {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onClose: () => void;
};

export function ConfirmDialog({
    open,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onClose
}: Props) {
    useEffect(() => {
        if (!open) return;

        // UX: ESC fecha modal
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
            <div className={styles.modal} role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
                <div className={styles.title}>{title}</div>
                <div className={styles.msg}>{message}</div>

                <div className={styles.actions}>
                    <Button variant="ghost" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
