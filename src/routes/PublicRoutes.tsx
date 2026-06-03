import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegistroPage } from "../pages/auth/RegisterPage";

export function PublicRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/cadastro" element={<RegistroPage/>} />
            <Route path="/*" element={<Navigate to="/login" replace/>}/>
        </Routes>
    )
}