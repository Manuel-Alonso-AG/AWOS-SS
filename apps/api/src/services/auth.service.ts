import bcrypt from "bcryptjs";
import {
    createUsuario,
    findUsuarioByMatricula,
} from "../repositories/user.repository";
import type { Usuario, Rol } from "@awos-ss/types";

export async function loginUsuario(
    matricula: string,
    password: string,
): Promise<Usuario | null> {
    const usuario = await findUsuarioByMatricula(matricula);
    if (!usuario || !usuario.activo) return null;

    const match = await bcrypt.compare(password, usuario.passwordHash);

    if (!match) return null;

    return usuario;
}

export async function registarUsuario(
    matricula: string,
    email: string,
    password: string,
    rol: Rol,
): Promise<number | null> {
    const exist = await findUsuarioByMatricula(matricula);
    if (exist) return null;

    const passwordHash = await bcrypt.hash(password, 12);

    const usuario: Usuario = {
        id: 0,
        matricula,
        email,
        passwordHash,
        rol,
        activo: true,
    };

    return await createUsuario(usuario);
}
