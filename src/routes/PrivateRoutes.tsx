import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../pages/home/HomePage";
import { CursoPage } from "../pages/curso/CursoPage";
import { TurmaPage } from "../pages/turma/TurmaPage";
import { PerfilPage } from "../pages/perfil/PerfilPage";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { AppAdminLayout } from "../components/layouts/AppAdminLayout";



export function PrivateRoutes() {
    return (
        <Routes>
            <Route element={<AppAdminLayout />}>

                <Route path="/home" element={<ProtectedRoutes allowedRoles={["admin"]}>
                    <HomePage />
                </ProtectedRoutes>} />

                <Route path="/curso" element={<ProtectedRoutes allowedRoles={["admin"]}>
                    <CursoPage />
                </ProtectedRoutes>} />

                <Route path="/turma" element={<ProtectedRoutes allowedRoles={["admin"]}>
                    <TurmaPage />
                </ProtectedRoutes>} />

                <Route path="/perfil" element={<ProtectedRoutes allowedRoles={["admin"]}>
                    <PerfilPage />
                </ProtectedRoutes>} />

                <Route path="/*" element={<Navigate to="/app/home" replace />} />
            </Route>
        </Routes>
    );
}