DROP DATABASE IF EXISTS awos;
CREATE DATABASE awos
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE awos;
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM("estudiante", "institucion", "administrador") NOT NULL,
    activo TINYINT(1) DEFAULT 1
);
CREATE TABLE instituciones (
    id_institucion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNIQUE NOT NULL,
    nombre_legal VARCHAR(150) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    lat DECIMAL(10,7) NOT NULL,
    lng DECIMAL(10,7) NOT NULL,


    CONSTRAINT fk_institucion_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
CREATE TABLE areas (
    id_area INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    icono VARCHAR(100) NOT NULL
);
CREATE TABLE proyectos (
    id_proyecto INT AUTO_INCREMENT PRIMARY KEY,
    id_institucion INT NOT NULL,
    id_area INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    modalidad ENUM('presencial', 'remoto', 'hibrido') NOT NULL,
    horas_requeridas INT NOT NULL,
    plazas_total INT NOT NULL,
    plazas_ocupadas INT DEFAULT 0,
    estatus ENUM('borrador', 'publicado', 'cerrado') DEFAULT 'borrador',
    lat DECIMAL(10,7) NOT NULL,
    lng DECIMAL(10,7) NOT NULL,
    direccion_proyecto VARCHAR(255) NOT NULL,

    CONSTRAINT fk_proyecto_institucion
        FOREIGN KEY (id_institucion) REFERENCES instituciones(id_institucion)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_proyecto_area
        FOREIGN KEY (id_area) REFERENCES areas(id_area)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
CREATE TABLE postulaciones (
    id_postulacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_proyecto INT NOT NULL,
    carta_motivacion TEXT NOT NULL,
    estatus ENUM('pendiente', 'aceptada', 'rechazada', 'cancelada') DEFAULT 'pendiente',
    CONSTRAINT fk_postulacion_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_postulacion_proyecto
        FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT unique_postulacion
        UNIQUE (id_usuario, id_proyecto)
);
CREATE TABLE horas_registro (
    id_registro INT AUTO_INCREMENT PRIMARY KEY,
    id_postulacion INT NOT NULL,
    fecha_actividad DATE NOT NULL,
    horas DECIMAL(4,2) NOT NULL,
    descripcion TEXT NOT NULL,
    evidencia_url VARCHAR(255) NOT NULL,
    validado TINYINT(1) DEFAULT 0,
    validado_por INT,
    fecha_validacion DATETIME,
    CONSTRAINT fk_horas_postulacion
        FOREIGN KEY (id_postulacion) REFERENCES postulaciones(id_postulacion)
        ON DELETE CASCADE
        ON UPDATE CASCADE,


    CONSTRAINT fk_validado_por
        FOREIGN KEY (validado_por) REFERENCES usuarios(id_usuario)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
-- VISTA PARA EL KARDEX DE SERVICIO SOCIAL
CREATE VIEW vista_kardex_ss AS
SELECT
    u.id_usuario,
    u.matricula,
    p.id_proyecto,
    p.titulo,
    i.nombre_legal AS institucion,
    a.nombre AS area,
    p.horas_requeridas,
    COALESCE(SUM(hr.horas), 0) AS horas_registradas,


    COALESCE(SUM(CASE WHEN hr.validado = 1 THEN hr.horas ELSE 0 END), 0) AS horas_validadas,


    COALESCE(SUM(CASE WHEN hr.validado = 0 THEN hr.horas ELSE 0 END), 0) AS horas_pendientes,


    ROUND(
        (COALESCE(SUM(CASE WHEN hr.validado = 1 THEN hr.horas ELSE 0 END), 0)
        / p.horas_requeridas) * 100, 2
    ) AS porcentaje_avance


FROM postulaciones ps
JOIN usuarios u ON ps.id_usuario = u.id_usuario
JOIN proyectos p ON ps.id_proyecto = p.id_proyecto
JOIN instituciones i ON p.id_institucion = i.id_institucion
JOIN areas a ON p.id_area = a.id_area
LEFT JOIN horas_registro hr ON ps.id_postulacion = hr.id_postulacion
GROUP BY u.id_usuario, p.id_proyecto;
-- VISTA PARA MOSTRAR PROYECTOS EN EL MAPA
CREATE VIEW vista_proyectos_mapa AS
SELECT
    p.id_proyecto,
    p.titulo,
    i.nombre_legal AS institucion,
    a.nombre AS area,
    p.plazas_total,
    p.plazas_ocupadas,
    (p.plazas_total - p.plazas_ocupadas) AS plazas_disponibles,


    COALESCE(p.lat, i.lat) AS latitud,
    COALESCE(p.lng, i.lng) AS longitud
FROM proyectos p
JOIN instituciones i ON p.id_institucion = i.id_institucion
JOIN areas a ON p.id_area = a.id_area
WHERE p.estatus = 'publicado'
AND (p.plazas_total - p.plazas_ocupadas) > 0;

