// Punto de entrada post-login. Redirige automáticamente al panel correcto
// según el rol del usuario autenticado.

import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.ts";

export function DashboardPage() {
    const { usuario } = useAuth();

    if (usuario?.rol === "estudiante")
        return <Navigate to="/estudiante/proyectos" replace />;
    if (usuario?.rol === "institucion")
        return <Navigate to="/institucion/proyectos" replace />;

    return <p>Rol no reconocido.</p>;
}
