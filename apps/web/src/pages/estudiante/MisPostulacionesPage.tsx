import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { api, ApiError } from "@/api/client";

interface PostulacionConHoras {
    id_postulacion: number;
    id_proyecto: number;
    titulo: string;
    modalidad: string;
    horas_requeridas: number;
    institucion: string;
    estatus: string;
    horas_registradas: number;
    horas_validadas: number;
}

const estatusBadge = (s: string) =>
    ({
        aceptada: "badge-green",
        rechazada: "badge-red",
        pendiente: "badge-amber",
        cancelada: "badge-gray",
    })[s] || "badge-gray";
const modalidadBadge = (m: string) =>
    ({
        presencial: "badge-teal",
        remoto: "badge-blue",
        hibrido: "badge-amber",
    })[m] || "badge-gray";

const emptyHoras = {
    fecha_actividad: "",
    horas: "",
    descripcion: "",
    evidencia_url: "",
};

export function MisPostulacionesPage() {
    const {
        data: postulaciones,
        loading,
        error,
        refetch,
    } = useFetch<PostulacionConHoras[]>("/postulaciones/mis");

    const [postulacionSeleccionada, setPostulacionSeleccionada] = useState<
        number | null
    >(null);
    const [horasForm, setHorasForm] = useState(emptyHoras);
    const [registrando, setRegistrando] = useState(false);
    const [mensajeOk, setMensajeOk] = useState("");
    const [mensajeErr, setMensajeErr] = useState("");

    const set =
        (f: string) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setHorasForm((prev) => ({ ...prev, [f]: e.target.value }));

    const abrirModal = (id: number) => {
        setPostulacionSeleccionada(id);
        setHorasForm(emptyHoras);
        setMensajeOk("");
        setMensajeErr("");
    };
    const cerrarModal = () => {
        if (!registrando) setPostulacionSeleccionada(null);
    };

    const registrarHoras = async () => {
        if (!postulacionSeleccionada) return;
        const { fecha_actividad, horas, descripcion, evidencia_url } =
            horasForm;
        if (!fecha_actividad || !horas || !descripcion || !evidencia_url) {
            setMensajeErr("Todos los campos son obligatorios");
            return;
        }
        const horasNum = Number(horas);
        if (horasNum < 0.5 || horasNum > 12) {
            setMensajeErr("Las horas deben estar entre 0.5 y 12");
            return;
        }
        setRegistrando(true);
        setMensajeErr("");
        try {
            await api.post("/horas", {
                id_postulacion: postulacionSeleccionada,
                fecha_actividad,
                horas: horasNum,
                descripcion,
                evidencia_url,
            });
            setMensajeOk(
                "Horas registradas. Pendientes de validación por la institución.",
            );
            refetch();
        } catch (err) {
            setMensajeErr(
                err instanceof ApiError ? err.message : "Error al registrar",
            );
        } finally {
            setRegistrando(false);
        }
    };

    const aceptadas =
        postulaciones?.filter((p) => p.estatus === "aceptada") ?? [];
    const pendientes =
        postulaciones?.filter((p) => p.estatus === "pendiente") ?? [];
    const otras =
        postulaciones?.filter(
            (p) => p.estatus !== "aceptada" && p.estatus !== "pendiente",
        ) ?? [];

    if (loading)
        return (
            <div className="loading-state">
                <span className="spinner" />
                Cargando postulaciones...
            </div>
        );
    if (error)
        return (
            <div className="form-error" style={{ marginTop: "2rem" }}>
                ⚠ {error}
            </div>
        );

    return (
        <>
            <div className="page-header">
                <div className="page-header-text">
                    <div className="page-header-eyebrow">Mi actividad</div>
                    <h1>Mis postulaciones</h1>
                    <p className="page-header-sub">
                        {postulaciones?.length ?? 0} postulación
                        {(postulaciones?.length ?? 0) !== 1 ? "es" : ""} en
                        total
                    </p>
                </div>
            </div>

            {/* Estadísticas */}
            {(postulaciones?.length ?? 0) > 0 && (
                <div className="stat-grid" style={{ marginBottom: "1.5rem" }}>
                    <div className="stat-card accent">
                        <div className="stat-label">Aceptadas</div>
                        <div className="stat-value">{aceptadas.length}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Pendientes</div>
                        <div
                            className="stat-value"
                            style={{ color: "var(--warning)" }}
                        >
                            {pendientes.length}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Otras</div>
                        <div
                            className="stat-value"
                            style={{ color: "var(--text-muted)" }}
                        >
                            {otras.length}
                        </div>
                    </div>
                </div>
            )}

            {postulaciones?.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <div className="empty-title">
                        Aún no tienes postulaciones
                    </div>
                    <p className="empty-sub">
                        Explora los proyectos disponibles y postúlate al que más
                        te interese.
                    </p>
                    <a
                        href="/estudiante/proyectos"
                        className="btn btn-primary"
                        style={{ marginTop: "0.5rem" }}
                    >
                        Explorar proyectos
                    </a>
                </div>
            )}

            {postulaciones && postulaciones.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    {postulaciones.map((p) => {
                        const pctAvance =
                            p.horas_requeridas > 0
                                ? Math.min(
                                      Math.round(
                                          (p.horas_validadas /
                                              p.horas_requeridas) *
                                              100,
                                      ),
                                      100,
                                  )
                                : 0;
                        return (
                            <div
                                key={p.id_postulacion}
                                className={`card ${p.estatus === "aceptada" ? "card-accent" : ""}`}
                            >
                                <div
                                    className="card-header"
                                    style={{ marginBottom: "0.75rem" }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                                marginBottom: "0.25rem",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <span
                                                className={`badge ${estatusBadge(p.estatus)}`}
                                            >
                                                {p.estatus}
                                            </span>
                                            <span
                                                className={`badge ${modalidadBadge(p.modalidad)}`}
                                            >
                                                {p.modalidad}
                                            </span>
                                        </div>
                                        <h3 style={{ margin: 0 }}>
                                            {p.titulo}
                                        </h3>
                                        <p
                                            className="text-muted text-sm"
                                            style={{ marginTop: "0.2rem" }}
                                        >
                                            🏛️ {p.institucion}
                                        </p>
                                    </div>
                                    {p.estatus === "aceptada" && (
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() =>
                                                abrirModal(p.id_postulacion)
                                            }
                                        >
                                            + Registrar horas
                                        </button>
                                    )}
                                </div>

                                {p.estatus === "aceptada" && (
                                    <>
                                        <div className="progress-wrap">
                                            <div className="progress-label">
                                                <span>Progreso de horas</span>
                                                <span>
                                                    {p.horas_validadas}h
                                                    validadas /{" "}
                                                    {p.horas_requeridas}h
                                                    requeridas
                                                </span>
                                            </div>
                                            <div className="progress-track">
                                                <div
                                                    className={`progress-bar ${pctAvance < 30 ? "danger" : pctAvance < 60 ? "warning" : ""}`}
                                                    style={{
                                                        width: `${pctAvance}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "repeat(3,1fr)",
                                                gap: "0.5rem",
                                                marginTop: "0.75rem",
                                            }}
                                        >
                                            {[
                                                {
                                                    label: "Validadas",
                                                    val: `${p.horas_validadas}h`,
                                                    col: "var(--success)",
                                                },
                                                {
                                                    label: "Registradas",
                                                    val: `${p.horas_registradas}h`,
                                                    col: "var(--text-heading)",
                                                },
                                                {
                                                    label: "Requeridas",
                                                    val: `${p.horas_requeridas}h`,
                                                    col: "var(--text-muted)",
                                                },
                                            ].map((item) => (
                                                <div
                                                    key={item.label}
                                                    style={{
                                                        background:
                                                            "var(--surface-2)",
                                                        borderRadius:
                                                            "var(--radius)",
                                                        padding: "0.5rem",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontWeight: 700,
                                                            fontFamily:
                                                                "var(--font-display)",
                                                            color: item.col,
                                                            fontSize: "1.1rem",
                                                        }}
                                                    >
                                                        {item.val}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "0.65rem",
                                                            color: "var(--text-muted)",
                                                            textTransform:
                                                                "uppercase",
                                                            letterSpacing:
                                                                "0.06em",
                                                        }}
                                                    >
                                                        {item.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal registro de horas */}
            {postulacionSeleccionada !== null && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) cerrarModal();
                    }}
                >
                    <div className="modal" style={{ maxWidth: 540 }}>
                        <div className="modal-header">
                            <h2>Registrar horas de trabajo</h2>
                            <button
                                className="modal-close"
                                onClick={cerrarModal}
                                disabled={registrando}
                            >
                                ✕
                            </button>
                        </div>
                        {mensajeOk ? (
                            <div className="modal-body">
                                <div className="form-success">
                                    ✓ {mensajeOk}
                                </div>
                            </div>
                        ) : (
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label
                                            className="form-label"
                                            htmlFor="fecha"
                                        >
                                            Fecha de actividad
                                        </label>
                                        <input
                                            id="fecha"
                                            className="form-input"
                                            type="date"
                                            value={horasForm.fecha_actividad}
                                            onChange={set("fecha_actividad")}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label
                                            className="form-label"
                                            htmlFor="horas"
                                        >
                                            Horas (0.5 – 12)
                                        </label>
                                        <input
                                            id="horas"
                                            className="form-input"
                                            type="number"
                                            min={0.5}
                                            max={12}
                                            step={0.5}
                                            value={horasForm.horas}
                                            onChange={set("horas")}
                                            placeholder="Ej. 4.5"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label
                                        className="form-label"
                                        htmlFor="descripcion"
                                    >
                                        Descripción de actividades
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        className="form-textarea"
                                        rows={3}
                                        value={horasForm.descripcion}
                                        onChange={set("descripcion")}
                                        placeholder="Describe detalladamente las actividades realizadas..."
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        className="form-label"
                                        htmlFor="evidencia"
                                    >
                                        URL de evidencia{" "}
                                        <span
                                            style={{
                                                color: "var(--text-muted)",
                                                fontWeight: 400,
                                            }}
                                        >
                                            (Drive, GitHub, Notion, etc.)
                                        </span>
                                    </label>
                                    <input
                                        id="evidencia"
                                        className="form-input"
                                        type="url"
                                        value={horasForm.evidencia_url}
                                        onChange={set("evidencia_url")}
                                        placeholder="https://drive.google.com/..."
                                        required
                                    />
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
                                    onClick={cerrarModal}
                                >
                                    Cerrar
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={cerrarModal}
                                        disabled={registrando}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={registrarHoras}
                                        disabled={registrando}
                                    >
                                        {registrando ? (
                                            <>
                                                <span
                                                    className="spinner"
                                                    style={{
                                                        width: 14,
                                                        height: 14,
                                                        borderWidth: 2,
                                                    }}
                                                />
                                                Guardando...
                                            </>
                                        ) : (
                                            "Guardar horas"
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
