export type Rol = "estudiante" | "institucion" | "administrador";

export type EstatusPostulacion = "pendiente" | "aceptada" | "rechazada";

export type EstatusProyecto = "activo" | "inactivo" | "completado";

export type Modalidad = "presencial" | "remoto" | "hibrido";

export interface Usuario {
    id: number;
    matricula: string;
    email: string;
    passwordHash: string;
    rol: Rol;
    activo: boolean;
}

export interface Areas {
    id: number;
    nombre: string;
}

export interface Instituciones {
    id: number;
    usuario: Usuario;
    nombre: string;
    tipo: string;
    lat: number;
    lng: number;
}

export interface Postulaciones {
    id: number;
    usuario: Usuario;
    cartaMotivacion: string;
    estatus: EstatusPostulacion;
}

export interface Proyectos {
    id: number;
    institucion: Instituciones;
    area: Areas;
    titulo: string;
    modalidad: Modalidad;
    horasRequeridas: number;
    plazasTotales: number;
    plazasOcupadas: number;
    estatus: EstatusProyecto;
    lat: number;
    lng: number;
    direccionProyecto: string;
}

export interface horasRegistro {
    id: number;
    idPostulacion: Postulaciones;
    fechaActividad: Date;
    horas: number;
    descripcion: string;
    evidenciaUrl: string;
    validado: boolean;
    validado_por: Usuario;
    fechaValidacion: Date;
}

export interface VistaKardexSS {
    idUsuario: number;
    matricula: string;
    id_proyecto: number;
    titulo: string;
    institucion: string;
    area: string;
    horasRequeridas: number;
}

export interface VistaProyectosMapa {
    idProyecto: number;
    titulo: string;
    institucion: string;
    area: string;
    plazasTotal: number;
    plazasOcupadas: number;
    plazasDisponibles: number;
}

export interface ApiResponse<T = any> {
    data?: T;
    success: boolean;
    message: string;
    errors?: string[];
}
