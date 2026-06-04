import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { SideBar } from "./SideBar";


const alunoNavItems = [
  { label: "Home", href: "/api/home" },
  { label: "Meus Cursos", href: "/api/cursos" }
];

export function AppAlunoLayout() {
    return (
        <>
            <div className="min-h-screen bg-muted/40">
                <SideBar navigationItems={alunoNavItems} />
                <div className="flex min-h-screen flex-col pl-64">
                    <Header />
                    <main className="flex-1 p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}