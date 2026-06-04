import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { PrivateRoutes } from "./PrivateRoutes";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import { useAuth } from "../contexts/AuthContext";
import { AppAdminLayout } from "../components/layouts/AppAdminLayout";
import { AppAlunoLayout } from "../components/layouts/AppAlunoLayout";
import { AlunoPrivateRoutes } from "./AlunoPrivateRoutes";


export function AppRoutes() {
    const { control } = useAuth();

    if (control) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <p className="text-lg font-semibold text-gray-600 animate-pulse">
                    Verificando autenticação...
                </p>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppAdminLayout />}>
                    <Route path="/app/*" element={<PrivateRoutes />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                </Route>

                <Route element={<AppAlunoLayout />}>
                    <Route path="/api/*" element={<AlunoPrivateRoutes />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                </Route>

                <Route path="/*" element={<PublicRoutes />} />
            </Routes>
        </BrowserRouter>
    )
}