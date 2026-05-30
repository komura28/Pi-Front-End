import type { ReactNode } from "react";




 interface IButton {
    isSubmitting: boolean;
    label: ReactNode;
    loadingLabel?: string;
    className?: string;
}

export function Button({isSubmitting, label, loadingLabel="Enviando...", className, ...props}: IButton) {
    return (
        <button
                        disabled={isSubmitting} className={className} {...props}
                        //className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition houver:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {isSubmitting ? loadingLabel : label}
                    </button>
    )
}