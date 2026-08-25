import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../pages/home/HomePage";
import { CursoPage } from "../pages/curso/CursoPage";
import { PerfilPage } from "../pages/perfil/PerfilPage";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { MatriculaPage } from "../pages/matricula/MatriculaPage";
import { CursoCadastroPage } from "../pages/curso/CursoCadastroPage";
import { TurmaCadastroPage } from "../pages/turma/TurmaCadastroPage";
import { TurmaPage } from "../pages/turma/TurmaPage";
import { UserPage } from "../pages/user/UserPage";

export function PrivateRoutes() {
    return (
        <Routes>

            <Route path="/home" element={<ProtectedRoutes allowedRoles={["ADM"]}>
                <HomePage />
            </ProtectedRoutes>} />

            <Route path="/curso" element={<ProtectedRoutes allowedRoles={["ADM"]}>
                <CursoPage />
            </ProtectedRoutes>} />

            <Route path="/user" element={<ProtectedRoutes allowedRoles={["ADM"]}>
                <UserPage />
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

            <Route path="/register-curso" element={<ProtectedRoutes allowedRoles={["ADM"]}>
                <CursoCadastroPage />
            </ProtectedRoutes>} />

            <Route path="/register-turma" element={<ProtectedRoutes allowedRoles={["ADM"]}>
                <TurmaCadastroPage />
            </ProtectedRoutes>} />

            <Route path="/*" element={<Navigate to="/app/home" replace />} />
        </Routes>
    );
}