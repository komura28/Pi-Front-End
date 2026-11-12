import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { PrivateRoutes } from "./PrivateRoutes";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import { useAuth } from "../contexts/AuthContext";
import { AppAdminLayout } from "../components/layouts/AppAdminLayout";
import { AppAlunoLayout } from "../components/layouts/AppAlunoLayout";
import { AlunoPrivateRoutes } from "./AlunoPrivateRoutes";
import { AppProfessorLayout } from "../components/layouts/AppProfessorLayout";
import { ProfessorPrivateRoutes } from "./ProfessorPrivateRoutes";
import { PerfilPage } from "../pages/perfil/PerfilPage";

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

                <Route
                    element={
                        <ProtectedRoutes allowedRoles={["PROFESSOR"]}>
                            <AppProfessorLayout />
                        </ProtectedRoutes>
                    }
                >
                    <Route
                        path="/professor/*"
                        element={<ProfessorPrivateRoutes />}
                    />
                </Route>

                <Route
                    path="/perfil"
                    element={
                        <ProtectedRoutes allowedRoles={["PROFESSOR"]}>
                            <PerfilPage />
                        </ProtectedRoutes>
                    }
                />

                <Route path="/*" element={<PublicRoutes />} />
            </Routes>
        </BrowserRouter>
    )
}