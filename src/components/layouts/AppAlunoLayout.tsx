import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { FaGraduationCap, FaHome } from "react-icons/fa";


const alunoNavItems = [
    { label: "Home", href: "/api/home", icon: <FaHome/> },
    { label: "Meus Cursos", href: "/api/cursos", icon: <FaGraduationCap/> },
    
];

export function AppAlunoLayout() {
    return (
        <>
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Header navigationItems={alunoNavItems} link="/api/home" mode="ALUNO" />
                <div className="flex-1">

                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
        </>
    );
}