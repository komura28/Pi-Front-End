import { NavLink } from "react-router-dom";


const navigationItems = [
    {
        label: "Dashboard",
        href: "/home",

    },
    {
        label: "Cursos",
        href: "/curso",

    },
    {
        label: "Turmas",
        href: "/turma",

    },
    {
        label: "Matrículas",
        href: "/matricula",

    },

]

export function SideBar() {
    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-10 flex w-64 flex-col border-r bg-background">
                <div className="flex h-16 items-center border-b px-6">
                    <div className="flex items-center gap-2">


                        <div>
                            <strong className="block leading-none">Aticurando</strong>
                            <span className="text-xs text-muted-foreground">
                                Gestão de palhaços
                            </span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 p-3">
                    {navigationItems.map((item) => {
                        return(
                        < NavLink
                            key={item.href}
                            to={item.href}
                            end={item.href === "/"}
                            className={({ isActive }) =>
                                
                                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground
                                    ${isActive ? 'bg-muted text-foreground' : ''}`
                                
                            }
                        >
                            {item.label}
                        </NavLink>
                        );
                    })}
                </nav>

                <div className="border-t p-4">
                    <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm font-medium">Organização atual</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Jaquin 
                        </p>
                    </div>
                </div>
            </aside >
        </>
    );
}