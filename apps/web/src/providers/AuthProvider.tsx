import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/api/client";
import type { Rol } from "@awos-ss/types";

interface AuthUser {
    id_usuario: number;
    matricula: string;
    email: string;
    rol: Rol;
    activo: boolean;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(() => {
        const token = localStorage.getItem("token");
        return !!token;
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }

        api.get<AuthUser>("/auth/perfil")
            .then(setUsuario)
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setLoading(false));
    }, []);

    const login = async (matricula: string, password: string) => {
        const data = await api.post<{ token: string; rol: Rol }>(
            "/auth/login",
            { matricula, password },
            false,
        );
        localStorage.setItem("token", data.token);
        const perfil = await api.get<AuthUser>("/auth/perfil");
        setUsuario(perfil);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
