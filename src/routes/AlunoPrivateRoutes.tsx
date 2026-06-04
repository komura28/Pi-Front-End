import { Route, Routes } from "react-router-dom";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { HomeAlunoPage } from "../pages/home/HomeAlunoPage";
import { PerfilPage } from "../pages/perfil/PerfilPage";
import { CursoAlunoPage } from "../pages/curso/CursoAlunoPage";



export function AlunoPrivateRoutes() {
    return (
        <Routes>
            <Route path="/home" element={<ProtectedRoutes allowedRoles={["ALUNO"]}>
                <HomeAlunoPage />
            </ProtectedRoutes>} />

            <Route path="/perfil" element={<ProtectedRoutes allowedRoles={["ALUNO"]}>
                <PerfilPage />
            </ProtectedRoutes>} />

            <Route path="/cursos" element={<ProtectedRoutes allowedRoles={["ALUNO"]}>
                <CursoAlunoPage />
            </ProtectedRoutes>} />
        </Routes>
    );
}