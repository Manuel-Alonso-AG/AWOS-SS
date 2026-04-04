import { proyectoRepository } from "../repositories/proyecto.repository.ts";
import { institucionRepository } from "../repositories/institucion.repository.ts";
import { geocodificar, distanciaKm } from "../config/maps.ts";
import { mapsApiKey } from "../config/env.ts";
import type {
    VistaProyectoMapa,
    Modalidad,
    EstatusProyecto,
} from "@awos-ss/types";

interface FiltrosProyecto {
    area?: number;
    modalidad?: Modalidad;
    lat?: number;
    lng?: number;
    radio?: number; // km
}

export const proyectosService = {
    async listar(filtros: FiltrosProyecto): Promise<{
        proyectos: (VistaProyectoMapa & { distancia_km?: number })[];
        maps_api_key: string;
    }> {
        let proyectos = await proyectoRepository.findAllMapa();

        // Filtro por área
        if (filtros.area) {
            proyectos = proyectos.filter((_p) => {
                // La vista no expone id_area directamente; se filtra por nombre si es necesario
                // Para un filtro robusto se puede añadir id_area a la vista SQL
                return true; // placeholder — se maneja en la capa de datos si se extiende la vista
            });
        }

        // Filtro por modalidad
        if (filtros.modalidad) {
            proyectos = proyectos.filter(
                (p) => p.modalidad === filtros.modalidad,
            );
        }

        // Cálculo de distancia y filtro por radio (Haversine server-side)
        let result: (VistaProyectoMapa & { distancia_km?: number })[] =
            proyectos;

        if (filtros.lat !== undefined && filtros.lng !== undefined) {
            result = proyectos
                .map((p) => ({
                    ...p,
                    distancia_km:
                        Math.round(
                            distanciaKm(
                                filtros.lat!,
                                filtros.lng!,
                                p.latitud,
                                p.longitud,
                            ) * 10,
                        ) / 10,
                }))
                .filter(
                    (p) =>
                        filtros.radio === undefined ||
                        p.distancia_km! <= filtros.radio,
                )
                .sort((a, b) => a.distancia_km! - b.distancia_km!);
        }

        return { proyectos: result, maps_api_key: mapsApiKey };
    },

    async detalle(id_proyecto: number) {
        const proyecto = await proyectoRepository.findById(id_proyecto);
        if (!proyecto) throw new Error("Proyecto no encontrado");
        return proyecto;
    },

    async misProyectos(id_usuario: number) {
        const institucion =
            await institucionRepository.findByUserId(id_usuario);
        if (!institucion)
            throw new Error("Perfil de institución no encontrado");
        return proyectoRepository.findByInstitucion(institucion.id_institucion);
    },

    async crear(
        id_usuario: number,
        datos: {
            id_area: number;
            titulo: string;
            modalidad: Modalidad;
            horas_requeridas: number;
            plazas_total: number;
            direccion_proyecto: string;
            estatus?: EstatusProyecto;
        },
    ) {
        const institucion =
            await institucionRepository.findByUserId(id_usuario);
        if (!institucion)
            throw new Error("Perfil de institución no encontrado");

        // Geocodificar la dirección del proyecto
        const coords = await geocodificar(datos.direccion_proyecto);
        const lat = coords?.lat ?? institucion.lat;
        const lng = coords?.lng ?? institucion.lng;

        const id_proyecto = await proyectoRepository.create({
            id_institucion: institucion.id_institucion,
            id_area: datos.id_area,
            titulo: datos.titulo,
            modalidad: datos.modalidad,
            horas_requeridas: datos.horas_requeridas,
            plazas_total: datos.plazas_total,
            estatus: datos.estatus ?? "borrador",
            lat,
            lng,
            direccion_proyecto: datos.direccion_proyecto,
        });

        return { id_proyecto };
    },

    async areas() {
        return proyectoRepository.findAllAreas();
    },
};
