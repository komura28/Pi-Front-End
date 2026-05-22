import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/home/HomePage";
//import { LoginPage } from "../pages/auth/LoginPage";


export function PublicRoutes() {
    return (
        <Routes>
            <Route path="/home" element={<HomePage />}/>
            <Route path="/*" element={<Navigate to="/home" replace/>}/>
        </Routes>
    )
}