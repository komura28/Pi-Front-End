import { Route, Routes } from "react-router-dom";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { HomeAlunoPage } from "../pages/home/HomeAlunoPage";


export function AlunoPrivateRoutes() {
    return (
        <Routes>
            <Route path="/home" element={<ProtectedRoutes allowedRoles={["ALUNO"]}>
                <HomeAlunoPage />
            </ProtectedRoutes>} />
        </Routes>
    );
}