import { useEffect, useState } from "react";

export function useAgora() {
    const [agora, setAgora] = useState(Date.now);

    useEffect(() => {
        const intervalo = window.setInterval(() => {
            setAgora(Date.now());
        }, 30000);

        return () => window.clearInterval(intervalo);
    }, []);

    return agora;
}