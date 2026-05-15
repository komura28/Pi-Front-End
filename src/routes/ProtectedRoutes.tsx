import type { ReactNode } from "react"
import { Navigate } from "react-router-dom";


type UserRole = "admin";

interface ProtectedRoutesProps{
    children: ReactNode,
    allowedRoles: UserRole[];
}

const authMock = {
    isAuthenticated: true,
    user: {
        name: "Matos Teste",
        role: "admin" as UserRole
    },
}

export function ProtectedRoutes({children, allowedRoles}: ProtectedRoutesProps) {
    if(!authMock.isAuthenticated) {
        return <Navigate to="/login" replace/>
    }

    if(!allowedRoles.includes(authMock.user.role)) {
        return <Navigate to="/unauthorized" replace/>
    }

    return (
        <>{children}</>
    );
}