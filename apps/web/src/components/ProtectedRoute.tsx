// Redirige a /login si el usuario no está autenticado.
// Si se indica `roles`, además verifica que el usuario tenga el rol correcto.

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.ts";
import type { Rol } from "@awos-ss/types";

interface Props {
    roles?: Rol[];
}

export function ProtectedRoute({ roles }: Props) {
    const { usuario, loading } = useAuth();

    if (loading) return <p>Cargando...</p>;

    if (!usuario) return <Navigate to="/login" replace />;

    if (roles && !roles.includes(usuario.rol)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
