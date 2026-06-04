import type { ReactNode } from "react"
import { Navigate, Outlet } from "react-router-dom";
import type { papelUsuario } from "../types/auth/auth-types";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRoutesProps{
    children: ReactNode,
    allowedRoles: papelUsuario[];
}

export function ProtectedRoutes({allowedRoles, children}: ProtectedRoutesProps) {

    const { isAuthenticated, user } = useAuth();

    if(!isAuthenticated) {
        return <Navigate to="/login" replace/>
    }

    if(user?.papelUsuario && !allowedRoles.includes(user.papelUsuario)) {
        return <Navigate to="/unauthorized" replace/>
    }

    return children ? <>{children}</> : <Outlet/>
}