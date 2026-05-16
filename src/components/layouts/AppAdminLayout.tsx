import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SideBar } from "./SideBar";


export function AppAdminLayout() {
    return (
        <>
            <div className="min-h-screen bg-muted/40">
                <SideBar />
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