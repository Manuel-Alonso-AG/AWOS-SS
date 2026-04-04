
-- ─────────────────────────────────────────────────────────────────────────────
-- DATOS DE PRUEBA (seed)
-- Contraseña para todos los usuarios de prueba: Test1234!
-- hash bcrypt generado con salt=12
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO areas (nombre, icono) VALUES
  ('Tecnologías de Información', 'icon-ti'),
  ('Salud', 'icon-salud'),
  ('Educación', 'icon-educacion'),
  ('Medio Ambiente', 'icon-ambiente'),
  ('Administración', 'icon-admin');

-- Usuario estudiante de prueba
INSERT INTO usuarios (matricula, email, password_hash, rol, activo) VALUES
  ('DEMO_EST', 'estudiante@demo.mx',
   '$2a$12$RHJ2I8H1hq4FiTRW2vVoiuMvTr8n3MNFZm1XqYJJtW.3N9ksTGhVq',
   'estudiante', 1);

-- Usuario institución de prueba
INSERT INTO usuarios (matricula, email, password_hash, rol, activo) VALUES
  ('DEMO_INST', 'institucion@demo.mx',
   '$2a$12$RHJ2I8H1hq4FiTRW2vVoiuMvTr8n3MNFZm1XqYJJtW.3N9ksTGhVq',
   'institucion', 1);

-- Perfil de institución (coords: Cuernavaca, Morelos)
INSERT INTO instituciones (id_usuario, nombre_legal, tipo, lat, lng) VALUES
  (2, 'Hospital General de Cuernavaca', 'publica', 18.9187, -99.2342);

-- Proyecto de prueba (publicado con plazas disponibles)
INSERT INTO proyectos
  (id_institucion, id_area, titulo, modalidad, horas_requeridas,
   plazas_total, plazas_ocupadas, estatus, lat, lng, direccion_proyecto)
VALUES
  (1, 1, 'Sistema de Gestión de Expedientes Clínicos', 'hibrido', 480,
   3, 0, 'publicado', 18.9187, -99.2342,
   'Av. Domingo Diez 1001, Cuernavaca, Morelos');