import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { ProfessorHomePage } from "../pages/professor/ProfessorHomePage";
import { ProfessorAgendaPage } from "../pages/professor/ProfessorAgendaPage";
import { ProfessorTurmasPage } from "../pages/professor/ProfessorTurmasPage";

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
                path="*"
                element={<Navigate to="/professor/home" replace />}
            />
        </Routes>
    );
}