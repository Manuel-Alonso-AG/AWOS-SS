import bcrypt from "bcryptjs";
import { usuarioRepository } from "../repositories/usuario.repository.ts";
import { institucionRepository } from "../repositories/institucion.repository.ts";
import { geocodificar } from "../config/maps.js";
import type { Usuario } from "@awos-ss/types";

export const authService = {
    /** Autentica al usuario; retorna el registro completo o null */
    async login(matricula: string, password: string): Promise<Usuario | null> {
        const usuario = await usuarioRepository.findByMatricula(matricula);
        if (!usuario || !usuario.activo) return null;
        const match = await bcrypt.compare(password, usuario.password_hash);
        return match ? usuario : null;
    },

    /** Registra un estudiante; lanza error si la matrícula/email ya existe */
    async registrarEstudiante(
        matricula: string,
        email: string,
        password: string,
    ): Promise<number> {
        const existe = await usuarioRepository.findByMatricula(matricula);
        if (existe) throw new Error("La matrícula ya está registrada");

        const password_hash = await bcrypt.hash(password, 12);
        return usuarioRepository.create({
            matricula,
            email,
            password_hash,
            rol: "estudiante",
            activo: true,
        });
    },

    /** Registra institución: crea usuario + perfil con geocodificación */
    async registrarInstitucion(datos: {
        matricula: string;
        email: string;
        password: string;
        nombre_legal: string;
        tipo: string;
        direccion: string;
    }): Promise<{ id_usuario: number; id_institucion: number }> {
        const existe = await usuarioRepository.findByMatricula(datos.matricula);
        if (existe) throw new Error("La matrícula ya está registrada");

        // Geocodificar la dirección para obtener lat/lng
        const coords = await geocodificar(datos.direccion);
        if (!coords)
            throw new Error(
                "No se pudo geocodificar la dirección proporcionada",
            );

        const password_hash = await bcrypt.hash(datos.password, 12);

        const id_usuario = await usuarioRepository.create({
            matricula: datos.matricula,
            email: datos.email,
            password_hash,
            rol: "institucion",
            activo: true,
        });

        const id_institucion = await institucionRepository.create({
            id_usuario,
            nombre_legal: datos.nombre_legal,
            tipo: datos.tipo,
            lat: coords.lat,
            lng: coords.lng,
        });

        return { id_usuario, id_institucion };
    },

    async getPerfil(
        id_usuario: number,
    ): Promise<Omit<Usuario, "password_hash"> | null> {
        const usuario = await usuarioRepository.findById(id_usuario);
        if (!usuario) return null;
        // Nunca se devuelve el hash de la contraseña al cliente
        const { password_hash: _, ...perfil } = usuario;
        return perfil;
    },
};
