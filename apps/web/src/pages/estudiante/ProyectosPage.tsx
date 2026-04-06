// Vista principal del estudiante: lista proyectos publicados con filtros.
// El mapa es responsabilidad del equipo de diseño — este componente
// expone la maps_api_key y las coordenadas para integrarlo.

import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { api, ApiError } from "@/api/client";
import type { Area } from "@awos-ss/types";

interface ProyectoConPost {
    id_proyecto: number;
    titulo: string;
    modalidad: string;
    horas_requeridas: number;
    plazas_total: number;
    plazas_ocupadas: number;
    estatus: string;
    total_postulaciones: number;
}

const estatusBadge = (s: string) =>
    ({
        publicado: "badge-green",
        borrador: "badge-amber",
        cerrado: "badge-red",
    })[s] || "badge-gray";
const modalidadBadge = (m: string) =>
    ({
        presencial: "badge-teal",
        remoto: "badge-blue",
        hibrido: "badge-amber",
    })[m] || "badge-gray";

const emptyForm = {
    id_area: "",
    titulo: "",
    modalidad: "",
    horas_requeridas: "",
    plazas_total: "",
    direccion_proyecto: "",
    estatus: "borrador",
};

export function MisProyectosPage() {
    const {
        data: proyectos,
        loading,
        error,
        refetch,
    } = useFetch<ProyectoConPost[]>("/proyectos/mis-proyectos");
    const { data: areas } = useFetch<Area[]>("/proyectos/areas");
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [creando, setCreando] = useState(false);
    const [ok, setOk] = useState("");
    const [err2, setErr2] = useState("");

    const set =
        (f: string) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setForm((prev) => ({ ...prev, [f]: e.target.value }));

    const abrirModal = () => {
        setForm(emptyForm);
        setOk("");
        setErr2("");
        setModal(true);
    };
    const cerrarModal = () => setModal(false);

    const crear = async () => {
        const {
            id_area,
            titulo,
            modalidad,
            horas_requeridas,
            plazas_total,
            direccion_proyecto,
            estatus,
        } = form;
        if (
            !id_area ||
            !titulo ||
            !modalidad ||
            !horas_requeridas ||
            !plazas_total ||
            !direccion_proyecto
        ) {
            setErr2("Todos los campos son obligatorios");
            return;
        }
        setCreando(true);
        setErr2("");
        try {
            await api.post("/proyectos", {
                id_area: Number(id_area),
                titulo,
                modalidad,
                horas_requeridas: Number(horas_requeridas),
                plazas_total: Number(plazas_total),
                direccion_proyecto,
                estatus,
            });
            setOk("Proyecto creado exitosamente.");
            refetch();
        } catch (e) {
            setErr2(
                e instanceof ApiError ? e.message : "Error al crear proyecto",
            );
        } finally {
            setCreando(false);
        }
    };

    if (loading)
        return (
            <div className="loading-state">
                <span className="spinner" />
                Cargando proyectos...
            </div>
        );
    if (error)
        return (
            <div className="form-error" style={{ marginTop: "2rem" }}>
                ⚠ {error}
            </div>
        );

    const publicados =
        proyectos?.filter((p) => p.estatus === "publicado") ?? [];
    const borradores = proyectos?.filter((p) => p.estatus === "borrador") ?? [];

    return (
        <>
            <div className="page-header">
                <div className="page-header-text">
                    <div className="page-header-eyebrow">Gestión</div>
                    <h1>Mis proyectos</h1>
                    <p className="page-header-sub">
                        {proyectos?.length ?? 0} proyectos publicados
                    </p>
                </div>
                <button className="btn btn-primary" onClick={abrirModal}>
                    + Publicar proyecto
                </button>
            </div>

            <div className="stat-grid">
                <div className="stat-card accent">
                    <div className="stat-label">Publicados</div>
                    <div className="stat-value">{publicados.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Borradores</div>
                    <div
                        className="stat-value"
                        style={{ color: "var(--warning)" }}
                    >
                        {borradores.length}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Postulaciones</div>
                    <div className="stat-value">
                        {proyectos?.reduce(
                            (a, p) => a + p.total_postulaciones,
                            0,
                        ) ?? 0}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Plazas ocupadas</div>
                    <div className="stat-value">
                        {proyectos?.reduce(
                            (a, p) => a + p.plazas_ocupadas,
                            0,
                        ) ?? 0}
                    </div>
                </div>
            </div>

            {proyectos?.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📌</div>
                    <div className="empty-title">Sin proyectos aún</div>
                    <p className="empty-sub">
                        Publica tu primer proyecto y conecta con estudiantes de
                        toda la república.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={abrirModal}
                        style={{ marginTop: "0.5rem" }}
                    >
                        + Publicar proyecto
                    </button>
                </div>
            )}

            {proyectos && proyectos.length > 0 && (
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Proyecto</th>
                                <th>Modalidad</th>
                                <th>Horas</th>
                                <th>Plazas</th>
                                <th>Postulaciones</th>
                                <th>Estatus</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proyectos.map((p) => {
                                const pct = Math.round(
                                    (p.plazas_ocupadas / p.plazas_total) * 100,
                                );
                                return (
                                    <tr key={p.id_proyecto}>
                                        <td>
                                            <div
                                                style={{
                                                    fontWeight: 600,
                                                    color: "var(--text-heading)",
                                                    marginBottom: "0.1rem",
                                                }}
                                            >
                                                {p.titulo}
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${modalidadBadge(p.modalidad)}`}
                                            >
                                                {p.modalidad}
                                            </span>
                                        </td>
                                        <td>{p.horas_requeridas}h</td>
                                        <td>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "0.25rem",
                                                    minWidth: 100,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: "0.8rem",
                                                        color: "var(--text-heading)",
                                                    }}
                                                >
                                                    {p.plazas_ocupadas}/
                                                    {p.plazas_total}
                                                </span>
                                                <div
                                                    className="progress-track"
                                                    style={{ height: 4 }}
                                                >
                                                    <div
                                                        className="progress-bar"
                                                        style={{
                                                            width: `${pct}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-blue">
                                                {p.total_postulaciones}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${estatusBadge(p.estatus)}`}
                                            >
                                                {p.estatus}
                                            </span>
                                        </td>
                                        <td>
                                            <Link
                                                to={`/institucion/proyectos/${p.id_proyecto}/postulaciones`}
                                                className="btn btn-secondary btn-sm"
                                            >
                                                Ver postulantes
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal crear proyecto */}
            {modal && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !creando)
                            cerrarModal();
                    }}
                >
                    <div className="modal" style={{ maxWidth: 580 }}>
                        <div className="modal-header">
                            <h2>Nuevo proyecto</h2>
                            <button
                                className="modal-close"
                                onClick={cerrarModal}
                                disabled={creando}
                            >
                                ✕
                            </button>
                        </div>
                        {ok ? (
                            <div className="modal-body">
                                <div
                                    className="form-success"
                                    style={{ fontSize: "0.9375rem" }}
                                >
                                    🎉 {ok}
                                </div>
                            </div>
                        ) : (
                            <div className="modal-body">
                                <div className="form-group">
                                    <label
                                        className="form-label"
                                        htmlFor="titulo"
                                    >
                                        Título del proyecto
                                    </label>
                                    <input
                                        id="titulo"
                                        className="form-input"
                                        type="text"
                                        value={form.titulo}
                                        onChange={set("titulo")}
                                        placeholder="Ej. Desarrollo de sistema de gestión escolar"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label
                                            className="form-label"
                                            htmlFor="id_area"
                                        >
                                            Área de conocimiento
                                        </label>
                                        <select
                                            id="id_area"
                                            className="form-select"
                                            value={form.id_area}
                                            onChange={set("id_area")}
                                            required
                                        >
                                            <option value="">
                                                Selecciona...
                                            </option>
                                            {areas?.map((a) => (
                                                <option
                                                    key={a.id_area}
                                                    value={a.id_area}
                                                >
                                                    {a.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label
                                            className="form-label"
                                            htmlFor="modalidad"
                                        >
                                            Modalidad
                                        </label>
                                        <select
                                            id="modalidad"
                                            className="form-select"
                                            value={form.modalidad}
                                            onChange={set("modalidad")}
                                            required
                                        >
                                            <option value="">
                                                Selecciona...
                                            </option>
                                            <option value="presencial">
                                                Presencial
                                            </option>
                                            <option value="remoto">
                                                Remoto
                                            </option>
                                            <option value="hibrido">
                                                Híbrido
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label
                                            className="form-label"
                                            htmlFor="horas"
                                        >
                                            Horas requeridas
                                        </label>
                                        <input
                                            id="horas"
                                            className="form-input"
                                            type="number"
                                            min={1}
                                            value={form.horas_requeridas}
                                            onChange={set("horas_requeridas")}
                                            placeholder="Ej. 480"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label
                                            className="form-label"
                                            htmlFor="plazas"
                                        >
                                            Plazas disponibles
                                        </label>
                                        <input
                                            id="plazas"
                                            className="form-input"
                                            type="number"
                                            min={1}
                                            value={form.plazas_total}
                                            onChange={set("plazas_total")}
                                            placeholder="Ej. 5"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label
                                        className="form-label"
                                        htmlFor="direccion"
                                    >
                                        Dirección del proyecto{" "}
                                        <span
                                            style={{
                                                color: "var(--accent)",
                                                fontSize: "0.7rem",
                                            }}
                                        >
                                            (geocodificación automática)
                                        </span>
                                    </label>
                                    <input
                                        id="direccion"
                                        className="form-input"
                                        type="text"
                                        value={form.direccion_proyecto}
                                        onChange={set("direccion_proyecto")}
                                        placeholder="Calle, número, colonia, ciudad, estado"
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        className="form-label"
                                        htmlFor="estatus"
                                    >
                                        Publicar como
                                    </label>
                                    <select
                                        id="estatus"
                                        className="form-select"
                                        value={form.estatus}
                                        onChange={set("estatus")}
                                    >
                                        <option value="borrador">
                                            Borrador (no visible)
                                        </option>
                                        <option value="publicado">
                                            Publicado (visible para estudiantes)
                                        </option>
                                    </select>
                                </div>
                                {err2 && (
                                    <div className="form-error">⚠ {err2}</div>
                                )}
                            </div>
                        )}
                        <div className="modal-footer">
                            {ok ? (
                                <button
                                    className="btn btn-secondary"
                                    onClick={cerrarModal}
                                >
                                    Cerrar
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={cerrarModal}
                                        disabled={creando}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={crear}
                                        disabled={creando}
                                    >
                                        {creando ? (
                                            <>
                                                <span
                                                    className="spinner"
                                                    style={{
                                                        width: 14,
                                                        height: 14,
                                                        borderWidth: 2,
                                                    }}
                                                />
                                                Geocodificando...
                                            </>
                                        ) : (
                                            "Crear proyecto"
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
