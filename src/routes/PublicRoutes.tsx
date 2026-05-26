import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/auth/LoginPage";

export function PublicRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/*" element={<Navigate to="/app/home" replace/>}/>
        </Routes>
    )
}