import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { ProfessorHomePage } from "../pages/professor/ProfessorHomePage";
import { ProfessorAgendaPage } from "../pages/professor/ProfessorAgendaPage";
import { ProfessorTurmasPage } from "../pages/professor/ProfessorTurmasPage";
import { ProfessorChamadaPage } from "../pages/professor/ProfessorChamadaPage";
import { ProfessorFrequenciaPage } from "../pages/professor/ProfessorFrequenciaPage";
import { PerfilPage } from "../pages/perfil/PerfilPage";

export function ProfessorPrivateRoutes() {
    return (
        <Routes>
            <Route
                path="/home"
                element={
                    <ProtectedRoutes allowedRoles={["PROFESSOR"]}>
                        <ProfessorHomePage />
                    </ProtectedRoutes>
                }
            />

            <Route
                path="/agenda"
                element={
                    <ProtectedRoutes allowedRoles={["PROFESSOR"]}>
                        <ProfessorAgendaPage />
                    </ProtectedRoutes>
                }
            />

            <Route
                path="/turmas"
                element={
                    <ProtectedRoutes allowedRoles={["PROFESSOR"]}>
                        <ProfessorTurmasPage />
                    </ProtectedRoutes>
                }
            />

            <Route
                path="/aulas/:aulaTurmaId/chamada"
                element={
                    <ProtectedRoutes allowedRoles={["PROFESSOR"]}>
                        <ProfessorChamadaPage />
                    </ProtectedRoutes>
                }
            />

            <Route
                path="/turmas/:turmaId/frequencia"
                element={
                    <ProtectedRoutes allowedRoles={["PROFESSOR"]}>
                        <ProfessorFrequenciaPage />
                    </ProtectedRoutes>
                }
            />

            <Route
                path="/perfil"
                element={
                    <ProtectedRoutes allowedRoles={["PROFESSOR"]}>
                        <PerfilPage />
                    </ProtectedRoutes>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/professor/home" replace />}
            />
        </Routes>
    );
}