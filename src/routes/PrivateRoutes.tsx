import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../pages/home/HomePage";
import { CursoPage } from "../pages/curso/CursoPage";
import { TurmaPage } from "../pages/turma/TurmaPage";
import { PerfilPage } from "../pages/perfil/PerfilPage";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { MatriculaPage } from "../pages/matricula/MatriculaPage";

export function PrivateRoutes() {
    return (
        <Routes>

            <Route path="/home" element={<ProtectedRoutes allowedRoles={["ADMIN"]}>
                <HomePage />
            </ProtectedRoutes>} />

            <Route path="/curso" element={<ProtectedRoutes allowedRoles={["ADMIN"]}>
                <CursoPage />
            </ProtectedRoutes>} />

            <Route path="/turma" element={<ProtectedRoutes allowedRoles={["ADMIN"]}>
                <TurmaPage />
            </ProtectedRoutes>} />

            <Route path="/perfil" element={<ProtectedRoutes allowedRoles={["ADMIN"]}>
                <PerfilPage />
            </ProtectedRoutes>} />

            <Route path="/matricula" element={<ProtectedRoutes allowedRoles={["ADMIN"]}>
                <MatriculaPage />
            </ProtectedRoutes>} />

            <Route path="/*" element={<Navigate to="/app/home" replace />} />
        </Routes>
    );
}