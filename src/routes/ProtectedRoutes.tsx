import type { ReactNode } from "react"
import { Navigate, Outlet } from "react-router-dom";
import type { userRole } from "../types/auth/auth-types";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRoutesProps{
    children: ReactNode,
    allowedRoles: userRole[];
}

export function ProtectedRoutes({allowedRoles, children}: ProtectedRoutesProps) {

    const { isAuthenticated, user } = useAuth();

    if(!isAuthenticated) {
        return <Navigate to="/login" replace/>
    }

    if(user?.role && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace/>
    }

    return children ? <>{children}</> : <Outlet/>
}