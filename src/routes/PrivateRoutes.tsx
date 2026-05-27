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

            <Route path="/home" element={<ProtectedRoutes allowedRoles={["ADM"]}>
                <HomePage />
            </ProtectedRoutes>} />

            <Route path="/curso" element={<ProtectedRoutes allowedRoles={["ADM"]}>
                <CursoPage />
            </ProtectedRoutes>} />

            <Route path="/turma" element={<ProtectedRoutes allowedRoles={["ADM"]}>
                <TurmaPage />
            </ProtectedRoutes>} />

            <Route path="/perfil" element={<ProtectedRoutes allowedRoles={["ADM"]}>
                <PerfilPage />
            </ProtectedRoutes>} />

            <Route path="/matricula" element={<ProtectedRoutes allowedRoles={["ADM"]}>
                <MatriculaPage />
            </ProtectedRoutes>} />

            <Route path="/*" element={<Navigate to="/app/home" replace />} />
        </Routes>
    );
}