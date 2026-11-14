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
                    <Route
                        path="/app/*"
                        element={<PrivateRoutes />}
                    />
                </Route>

                <Route element={<AppAlunoLayout />}>
                    <Route
                        path="/api/*"
                        element={<AlunoPrivateRoutes />}
                    />
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
                    path="/unauthorized"
                    element={<UnauthorizedPage />}
                />

                <Route
                    path="/*"
                    element={<PublicRoutes />}
                />
            </Routes>
        </BrowserRouter>
    );
}