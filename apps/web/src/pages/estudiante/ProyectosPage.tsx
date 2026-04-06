// Vista principal del estudiante: explora proyectos publicados con filtros.
import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import type { Area, VistaProyectoMapa } from "@awos-ss/types";

interface ProyectosResponse {
    proyectos: (VistaProyectoMapa & { distancia_km?: number })[];
    maps_api_key: string;
}

const modalidadBadge = (m: string) =>
    ({
        presencial: "badge-teal",
        remoto: "badge-blue",
        hibrido: "badge-amber",
    })[m] || "badge-gray";

export function ProyectosPage() {
    const [filtroArea, setFiltroArea] = useState("");
    const [filtroModalidad, setFiltroModalidad] = useState("");
    const [busqueda, setBusqueda] = useState("");

    const params = new URLSearchParams();
    if (filtroArea) params.set("area", filtroArea);
    if (filtroModalidad) params.set("modalidad", filtroModalidad);
    const queryStr = params.toString();
    const url = queryStr ? `/proyectos?${queryStr}` : "/proyectos";

    const { data, loading, error } = useFetch<ProyectosResponse>(url);
    const { data: areas } = useFetch<Area[]>("/proyectos/areas");

    const proyectos = data?.proyectos ?? [];
    const filtrados = busqueda.trim()
        ? proyectos.filter(
              (p) =>
                  p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                  p.institucion
                      .toLowerCase()
                      .includes(busqueda.toLowerCase()) ||
                  p.area.toLowerCase().includes(busqueda.toLowerCase()),
          )
        : proyectos;

    return (
        <>
            <div className="page-header">
                <div className="page-header-text">
                    <div className="page-header-eyebrow">Explorar</div>
                    <h1>Proyectos disponibles</h1>
                    <p className="page-header-sub">
                        {loading
                            ? "Cargando..."
                            : `${filtrados.length} proyecto${filtrados.length !== 1 ? "s" : ""} disponibles`}
                    </p>
                </div>
            </div>

            <div className="filters-bar">
                <input
                    className="form-input"
                    type="text"
                    placeholder="Buscar proyecto o institución..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ minWidth: 220 }}
                />
                <select
                    className="form-select"
                    value={filtroArea}
                    onChange={(e) => setFiltroArea(e.target.value)}
                >
                    <option value="">Todas las áreas</option>
                    {areas?.map((a) => (
                        <option key={a.id_area} value={a.id_area}>
                            {a.nombre}
                        </option>
                    ))}
                </select>
                <select
                    className="form-select"
                    value={filtroModalidad}
                    onChange={(e) => setFiltroModalidad(e.target.value)}
                >
                    <option value="">Todas las modalidades</option>
                    <option value="presencial">Presencial</option>
                    <option value="remoto">Remoto</option>
                    <option value="hibrido">Híbrido</option>
                </select>
                {(filtroArea || filtroModalidad || busqueda) && (
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                            setFiltroArea("");
                            setFiltroModalidad("");
                            setBusqueda("");
                        }}
                    >
                        ✕ Limpiar filtros
                    </button>
                )}
            </div>

            {!loading && !error && proyectos.length > 0 && (
                <div className="stat-grid" style={{ marginBottom: "1.5rem" }}>
                    <div className="stat-card accent">
                        <div className="stat-label">Disponibles</div>
                        <div className="stat-value">{proyectos.length}</div>
                        <div className="stat-sub">proyectos</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Presencial</div>
                        <div className="stat-value">
                            {
                                proyectos.filter(
                                    (p) => p.modalidad === "presencial",
                                ).length
                            }
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Remoto</div>
                        <div className="stat-value">
                            {
                                proyectos.filter(
                                    (p) => p.modalidad === "remoto",
                                ).length
                            }
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Híbrido</div>
                        <div className="stat-value">
                            {
                                proyectos.filter(
                                    (p) => p.modalidad === "hibrido",
                                ).length
                            }
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="loading-state">
                    <span className="spinner" />
                    Cargando proyectos...
                </div>
            )}
            {error && (
                <div className="form-error" style={{ marginTop: "1rem" }}>
                    ⚠ {error}
                </div>
            )}

            {!loading && !error && filtrados.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <div className="empty-title">
                        {proyectos.length === 0
                            ? "No hay proyectos disponibles"
                            : "Sin resultados"}
                    </div>
                    <p className="empty-sub">
                        {proyectos.length === 0
                            ? "Aún no hay proyectos publicados. Vuelve pronto."
                            : "Prueba con otros filtros."}
                    </p>
                </div>
            )}

            {!loading && filtrados.length > 0 && (
                <div className="grid grid-auto">
                    {filtrados.map((p) => {
                        const plazasDisp =
                            p.plazas_disponibles ??
                            p.plazas_total - p.plazas_ocupadas;
                        const pctOcupado = Math.round(
                            (p.plazas_ocupadas / p.plazas_total) * 100,
                        );
                        return (
                            <Link
                                key={p.id_proyecto}
                                to={`/estudiante/proyectos/${p.id_proyecto}`}
                                className="project-card"
                                style={{ textDecoration: "none" }}
                            >
                                <div>
                                    <div className="project-card-area">
                                        {p.area}
                                    </div>
                                    <div className="project-card-title">
                                        {p.titulo}
                                    </div>
                                    <div className="project-card-inst">
                                        🏛️ {p.institucion}
                                    </div>
                                </div>
                                <div className="project-card-meta">
                                    <span
                                        className={`badge ${modalidadBadge(p.modalidad)}`}
                                    >
                                        {p.modalidad}
                                    </span>
                                    {plazasDisp <= 2 && plazasDisp > 0 && (
                                        <span className="badge badge-amber">
                                            ⚡ Últimas plazas
                                        </span>
                                    )}
                                    {p.distancia_km !== undefined && (
                                        <span className="badge badge-gray">
                                            📍 {p.distancia_km} km
                                        </span>
                                    )}
                                </div>
                                <div className="project-card-footer">
                                    <div className="project-card-hours">
                                        <strong>{p.horas_requeridas}h</strong>{" "}
                                        requeridas
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-end",
                                            gap: "0.25rem",
                                            minWidth: 90,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "var(--text-muted)",
                                            }}
                                        >
                                            {plazasDisp}/{p.plazas_total} plazas
                                        </span>
                                        <div
                                            className="progress-track"
                                            style={{ width: 90, height: 4 }}
                                        >
                                            <div
                                                className={`progress-bar ${pctOcupado > 80 ? "danger" : ""}`}
                                                style={{
                                                    width: `${pctOcupado}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </>
    );
}
