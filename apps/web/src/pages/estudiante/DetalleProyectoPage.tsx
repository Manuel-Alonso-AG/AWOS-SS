import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, ApiError } from "@/api/client";
import { useFetch } from "@/hooks/useFetch";
import type { Proyecto } from "@awos-ss/types";

const modalidadBadge = (m: string) =>
    ({
        presencial: "badge-teal",
        remoto: "badge-blue",
        hibrido: "badge-amber",
    })[m] || "badge-gray";

export function DetalleProyectoPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        data: proyecto,
        loading,
        error,
    } = useFetch<Proyecto>(id ? `/proyectos/${id}` : null);

    const [carta, setCarta] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [mensajeOk, setMensajeOk] = useState("");
    const [mensajeErr, setMensajeErr] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const postularse = async () => {
        if (!carta.trim()) {
            setMensajeErr("Escribe una carta de motivación");
            return;
        }
        setEnviando(true);
        setMensajeErr("");
        try {
            await api.post("/postulaciones", {
                id_proyecto: Number(id),
                carta_motivacion: carta,
            });
            setMensajeOk("¡Postulación enviada exitosamente!");
            setCarta("");
        } catch (err) {
            setMensajeErr(
                err instanceof ApiError ? err.message : "Error al postularse",
            );
        } finally {
            setEnviando(false);
        }
    };

    if (loading)
        return (
            <div className="loading-state">
                <span className="spinner" />
                Cargando proyecto...
            </div>
        );
    if (error)
        return (
            <div className="form-error" style={{ marginTop: "2rem" }}>
                ⚠ {error}
            </div>
        );
    if (!proyecto) return null;

    const plazasDisp = proyecto.plazas_total - proyecto.plazas_ocupadas;
    const pctOcupado = Math.round(
        (proyecto.plazas_ocupadas / proyecto.plazas_total) * 100,
    );

    return (
        <>
            <div style={{ marginBottom: "1.5rem" }}>
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate(-1)}
                >
                    ← Volver a proyectos
                </button>
            </div>

            {/* Hero */}
            <div className="detail-hero">
                <div className="detail-badges">
                    <span
                        className={`badge ${modalidadBadge(proyecto.modalidad)}`}
                    >
                        {proyecto.modalidad}
                    </span>
                    {proyecto.estatus === "publicado" ? (
                        <span className="badge badge-green">● Publicado</span>
                    ) : (
                        <span className="badge badge-red">Cerrado</span>
                    )}
                    {plazasDisp <= 2 && plazasDisp > 0 && (
                        <span className="badge badge-amber">
                            ⚡ Últimas plazas
                        </span>
                    )}
                </div>
                <h1 className="detail-title">{proyecto.titulo}</h1>
                <p className="detail-inst">📍 {proyecto.direccion_proyecto}</p>

                <div className="detail-meta-row">
                    <div className="detail-meta-item">
                        <span className="label">Horas requeridas</span>
                        <span className="value">
                            {proyecto.horas_requeridas}h
                        </span>
                    </div>
                    <div className="detail-meta-item">
                        <span className="label">Plazas disponibles</span>
                        <span
                            className="value"
                            style={{
                                color:
                                    plazasDisp === 0
                                        ? "var(--danger)"
                                        : plazasDisp <= 2
                                          ? "var(--warning)"
                                          : "var(--success)",
                            }}
                        >
                            {plazasDisp} / {proyecto.plazas_total}
                        </span>
                    </div>
                    <div className="detail-meta-item">
                        <span className="label">Modalidad</span>
                        <span
                            className="value"
                            style={{ textTransform: "capitalize" }}
                        >
                            {proyecto.modalidad}
                        </span>
                    </div>
                </div>

                {/* Barra de ocupación */}
                <div className="progress-wrap" style={{ maxWidth: 360 }}>
                    <div className="progress-label">
                        <span>Ocupación de plazas</span>
                        <span>{pctOcupado}%</span>
                    </div>
                    <div className="progress-track">
                        <div
                            className={`progress-bar ${pctOcupado > 80 ? "danger" : pctOcupado > 50 ? "warning" : ""}`}
                            style={{ width: `${pctOcupado}%` }}
                        />
                    </div>
                </div>

                {proyecto.estatus === "publicado" && plazasDisp > 0 && (
                    <div style={{ marginTop: "1.5rem" }}>
                        {mensajeOk ? (
                            <div className="form-success">🎉 {mensajeOk}</div>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={() => setModalOpen(true)}
                            >
                                Postularme a este proyecto
                            </button>
                        )}
                    </div>
                )}
                {plazasDisp === 0 && (
                    <div
                        className="form-error"
                        style={{ marginTop: "1.5rem", maxWidth: 340 }}
                    >
                        ⚠ No hay plazas disponibles en este proyecto.
                    </div>
                )}
            </div>

            {/* Modal postulación */}
            {modalOpen && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !enviando) {
                            setModalOpen(false);
                            setMensajeErr("");
                        }
                    }}
                >
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Postularme al proyecto</h2>
                            <button
                                className="modal-close"
                                onClick={() => {
                                    setModalOpen(false);
                                    setMensajeErr("");
                                }}
                                disabled={enviando}
                            >
                                ✕
                            </button>
                        </div>
                        {mensajeOk ? (
                            <div className="modal-body">
                                <div className="form-success">
                                    🎉 {mensajeOk}
                                </div>
                                <p className="text-muted text-sm">
                                    La institución revisará tu carta y te
                                    notificará.
                                </p>
                            </div>
                        ) : (
                            <div className="modal-body">
                                <p className="text-muted text-sm">
                                    Explica por qué te interesa este proyecto y
                                    qué aportarías. La institución revisará tu
                                    solicitud.
                                </p>
                                <div className="form-group">
                                    <label
                                        className="form-label"
                                        htmlFor="carta"
                                    >
                                        Carta de motivación
                                    </label>
                                    <textarea
                                        id="carta"
                                        className="form-textarea"
                                        rows={6}
                                        value={carta}
                                        onChange={(e) =>
                                            setCarta(e.target.value)
                                        }
                                        placeholder="Describe tu experiencia, habilidades y motivación para participar en este proyecto de servicio social..."
                                        disabled={enviando}
                                        autoFocus
                                    />
                                    <small>{carta.length} caracteres</small>
                                </div>
                                {mensajeErr && (
                                    <div className="form-error">
                                        ⚠ {mensajeErr}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="modal-footer">
                            {mensajeOk ? (
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cerrar
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => {
                                            setModalOpen(false);
                                            setMensajeErr("");
                                        }}
                                        disabled={enviando}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={postularse}
                                        disabled={enviando}
                                    >
                                        {enviando ? (
                                            <>
                                                <span
                                                    className="spinner"
                                                    style={{
                                                        width: 14,
                                                        height: 14,
                                                        borderWidth: 2,
                                                    }}
                                                />
                                                Enviando...
                                            </>
                                        ) : (
                                            "Enviar postulación"
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
