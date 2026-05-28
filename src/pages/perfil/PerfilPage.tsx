import { useEffect, useState } from "react"
import { getMe } from "../../services/authService"
import type { authUser } from "../../types/auth/auth-types"
import { useAuth } from "../../contexts/AuthContext";

interface PerfilFormData {
    name: string,
    email: string;
    cpf: string
}

export function PerfilPage() {

    const [user, setUser] = useState<authUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function carregarDados() {
            try {
                setLoading(true);
                const data = await getMe();
                setUser(data.data);
            } catch (error) {
                console.error(error);
            }
        }
        carregarDados();
        console.log("user: ", user?.name);
    }, [])
    return (
        <div>
            <h1>Meu Perfil</h1>
            <section className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8 border border-slate-200">
                <div className="flex flex-col gap-2">
                        <label
                            htmlFor="name"
                            className="text-slate-800 font-medium"
                        >
                            Nome 
                        </label>
                        <input
                            value={user?.name}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900"
                            disabled
                        />
                        <label
                            htmlFor="email"
                            className="text-slate-800 font-medium"
                        >
                            E-mail 
                        </label>

                        <input
<<<<<<< HEAD
                            id="email"
                            type="text"
=======
                            value={user?.email}
>>>>>>> main
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900"
                            
                        />
                        <label
                            htmlFor="cpf"
                            className="text-slate-800 font-medium"
                        >
                            CPF 
                        </label>

                        <input
                            value={user?.cpf}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900"
                            disabled
                        />
                    </div>
            </section>
        </div>
    )
}