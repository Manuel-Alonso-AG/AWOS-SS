// ─── Enums / Literales ────────────────────────────────────────────────────────

export type Rol = "estudiante" | "institucion" | "administrador";
export type EstatusPostulacion =
    | "pendiente"
    | "aceptada"
    | "rechazada"
    | "cancelada";
export type EstatusProyecto = "borrador" | "publicado" | "cerrado";
export type Modalidad = "presencial" | "remoto" | "hibrido";

// ─── Entidades (mapeo 1-1 con columnas SQL) ───────────────────────────────────

export interface Usuario {
    id_usuario: number;
    matricula: string;
    email: string;
    password_hash: string;
    rol: Rol;
    activo: boolean;
}

export interface Institucion {
    id_institucion: number;
    id_usuario: number;
    nombre_legal: string;
    tipo: string;
    lat: number;
    lng: number;
}

export interface Area {
    id_area: number;
    nombre: string;
    icono: string;
}

export interface Proyecto {
    id_proyecto: number;
    id_institucion: number;
    id_area: number;
    titulo: string;
    modalidad: Modalidad;
    horas_requeridas: number;
    plazas_total: number;
    plazas_ocupadas: number;
    estatus: EstatusProyecto;
    lat: number;
    lng: number;
    direccion_proyecto: string;
}

export interface Postulacion {
    id_postulacion: number;
    id_usuario: number;
    id_proyecto: number;
    carta_motivacion: string;
    estatus: EstatusPostulacion;
}

export interface HorasRegistro {
    id_registro: number;
    id_postulacion: number;
    fecha_actividad: string;
    horas: number;
    descripcion: string;
    evidencia_url: string;
    validado: boolean;
    validado_por: number | null;
    fecha_validacion: string | null;
}

// ─── Vistas SQL ───────────────────────────────────────────────────────────────

export interface VistaProyectoMapa {
    id_proyecto: number;
    titulo: string;
    institucion: string;
    area: string;
    modalidad: Modalidad;
    horas_requeridas: number;
    plazas_total: number;
    plazas_ocupadas: number;
    plazas_disponibles: number;
    latitud: number;
    longitud: number;
    direccion_proyecto: string;
}

export interface VistaKardexSS {
    id_usuario: number;
    matricula: string;
    id_proyecto: number;
    titulo: string;
    institucion: string;
    area: string;
    horas_requeridas: number;
    horas_registradas: number;
    horas_validadas: number;
    horas_pendientes: number;
    porcentaje_avance: number;
}

// ─── JWT ──────────────────────────────────────────────────────────────────────

export interface TokenPayload {
    id_usuario: number;
    rol: Rol;
}

// ─── Respuesta estándar API ───────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string[];
}
