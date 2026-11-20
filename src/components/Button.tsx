import type { ButtonHTMLAttributes, ReactNode } from "react";




 interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    isSubmitting: boolean;
    label: ReactNode;
    loadingLabel?: string;
    className?: string;
}

export function Button({
    isSubmitting,
    label,
    loadingLabel = "Enviando...",
    className = "",
    disabled,
    ...props
}: IButton) {
    return (
        <button
            disabled={isSubmitting || disabled}
            className={`max-w-full ${className}`}
            {...props}
        >
            {isSubmitting ? loadingLabel : label}
        </button>
    );
}