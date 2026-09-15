import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegistroPage } from "../pages/auth/RegisterPage";
import { EsqueciSenhaPage } from "../pages/auth/EsqueciSenhaPage";

export function PublicRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/cadastro" element={<RegistroPage/>} />
            <Route path="/esqueci-senha" element={<EsqueciSenhaPage/>} />
            <Route path="/*" element={<Navigate to="/login" replace/>}/>
        </Routes>
    )
}