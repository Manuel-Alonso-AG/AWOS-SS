import { createContext } from "react";
import type { Rol } from "@awos-ss/types";

interface AuthUser {
    id_usuario: number;
    matricula: string;
    email: string;
    rol: Rol;
    activo: boolean;
}

export interface AuthContextValue {
    usuario: AuthUser | null;
    loading: boolean;
    login: (matricula: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
