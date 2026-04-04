import { horasRepository } from "../repositories/horas.repository.ts";
import { postulacionRepository } from "../repositories/postulacion.repository.ts";
import { proyectoRepository } from "../repositories/proyecto.repository.ts";
import { institucionRepository } from "../repositories/institucion.repository.ts";
import { usuarioRepository } from "../repositories/usuario.repository.ts";
import type { Rol } from "@awos-ss/types";

export const horasService = {
    async registrar(
        id_usuario: number,
        datos: {
            id_postulacion: number;
            fecha_actividad: string;
            horas: number;
            descripcion: string;
            evidencia_url: string;
        },
    ) {
        if (datos.horas < 0.5 || datos.horas > 12)
            throw new Error("Las horas deben estar entre 0.5 y 12");

        // Verificar que la postulación exista, pertenezca al estudiante y esté aceptada
        const postulacion = await postulacionRepository.findById(
            datos.id_postulacion,
        );
        if (!postulacion) throw new Error("Postulación no encontrada");
        if (postulacion.id_usuario !== id_usuario)
            throw new Error("No tienes permisos sobre esta postulación");
        if (postulacion.estatus !== "aceptada")
            throw new Error(
                "Solo puedes registrar horas en postulaciones aceptadas",
            );

        const id_registro = await horasRepository.create(datos);
        return { id_registro };
    },

    async validar(
        id_registro: number,
        validado: boolean,
        id_usuario_institucion: number,
    ) {
        const registro = await horasRepository.findById(id_registro);
        if (!registro) throw new Error("Registro no encontrado");

        // Verificar que el registro pertenezca a un proyecto de la institución
        const postulacion = await postulacionRepository.findById(
            registro.id_postulacion,
        );
        if (!postulacion) throw new Error("Postulación no encontrada");

        const proyecto = await proyectoRepository.findById(
            postulacion.id_proyecto,
        );
        if (!proyecto) throw new Error("Proyecto no encontrado");

        const institucion = await institucionRepository.findByUserId(
            id_usuario_institucion,
        );
        if (
            !institucion ||
            institucion.id_institucion !== proyecto.id_institucion
        )
            throw new Error("No tienes permisos sobre este registro");

        await horasRepository.validar(
            id_registro,
            validado,
            id_usuario_institucion,
        );
        return { id_registro, validado };
    },

    async kardex(matricula: string, id_usuario_solicitante: number, rol: Rol) {
        // Estudiante solo puede ver su propio kardex
        if (rol === "estudiante") {
            const usuario = await usuarioRepository.findById(
                id_usuario_solicitante,
            );
            if (!usuario || usuario.matricula !== matricula)
                throw new Error(
                    "Acceso denegado: solo puedes ver tu propio kardex",
                );
        }
        return horasRepository.kardexByMatricula(matricula);
    },

    async pendientes(id_usuario_institucion: number) {
        const institucion = await institucionRepository.findByUserId(
            id_usuario_institucion,
        );
        if (!institucion)
            throw new Error("Perfil de institución no encontrado");
        return horasRepository.pendientesByInstitucion(
            institucion.id_institucion,
        );
    },
};
