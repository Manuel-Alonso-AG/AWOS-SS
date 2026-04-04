import { postulacionRepository } from "../repositories/postulacion.repository.ts";
import { proyectoRepository } from "../repositories/proyecto.repository.ts";
import { institucionRepository } from "../repositories/institucion.repository.ts";

export const postulacionesService = {
    async postular(
        id_usuario: number,
        id_proyecto: number,
        carta_motivacion: string,
    ) {
        // Verificar que el proyecto exista y tenga plazas
        const proyecto = await proyectoRepository.findById(id_proyecto);
        if (!proyecto) throw new Error("Proyecto no encontrado");
        if (proyecto.estatus !== "publicado")
            throw new Error("El proyecto no está disponible");
        if (proyecto.plazas_ocupadas >= proyecto.plazas_total)
            throw new Error("El proyecto no tiene plazas disponibles");

        // Evitar postulación duplicada
        const existe = await postulacionRepository.findByUsuarioYProyecto(
            id_usuario,
            id_proyecto,
        );
        if (existe)
            throw new Error("Ya existe una postulación para este proyecto");

        const id_postulacion = await postulacionRepository.create({
            id_usuario,
            id_proyecto,
            carta_motivacion,
        });

        return { id_postulacion };
    },

    async misPostulaciones(id_usuario: number) {
        return postulacionRepository.findByUsuario(id_usuario);
    },

    async postulacionesDeProyecto(
        id_proyecto: number,
        id_usuario_institucion: number,
    ) {
        // Verificar que el proyecto pertenezca a la institución del usuario
        const proyecto = await proyectoRepository.findById(id_proyecto);
        if (!proyecto) throw new Error("Proyecto no encontrado");

        const institucion = await institucionRepository.findByUserId(
            id_usuario_institucion,
        );
        if (
            !institucion ||
            institucion.id_institucion !== proyecto.id_institucion
        )
            throw new Error("No tienes permisos sobre este proyecto");

        return postulacionRepository.findByProyecto(id_proyecto);
    },

    async responder(
        id_postulacion: number,
        estatus: "aceptada" | "rechazada",
        id_usuario_institucion: number,
    ) {
        const postulacion =
            await postulacionRepository.findById(id_postulacion);
        if (!postulacion) throw new Error("Postulación no encontrada");
        if (postulacion.estatus !== "pendiente")
            throw new Error("La postulación ya fue procesada");

        // Verificar que la institución sea dueña del proyecto
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
            throw new Error("No tienes permisos sobre esta postulación");

        // Ejecuta transacción SQL (UPDATE postulaciones + UPDATE proyectos)
        await postulacionRepository.responder(
            id_postulacion,
            estatus,
            postulacion.id_proyecto,
        );

        return { id_postulacion, estatus };
    },
};
