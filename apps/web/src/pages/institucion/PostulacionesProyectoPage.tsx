import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { api, ApiError } from "@/api/client";
import { useState } from "react";

interface Postulante {
    id_postulacion: number;
    matricula: string;
    email: string;
    carta_motivacion: string;
    estatus: string;
}

const estatusBadge = (s: string) =>
    ({
        aceptada: "badge-green",
        rechazada: "badge-red",
        pendiente: "badge-amber",
        cancelada: "badge-gray",
    })[s] || "badge-gray";

export function PostulacionesProyectoPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        data: postulantes,
        loading,
        error,
        refetch,
    } = useFetch<Postulante[]>(id ? `/postulaciones/proyecto/${id}` : null);

    const [procesando, setProcesando] = useState<number | null>(null);
    const [mensajes, setMensajes] = useState<
        Record<number, { ok: boolean; msg: string }>
    >({});
    const [cartaAbierta, setCartaAbierta] = useState<number | null>(null);

    const responder = async (
        id_postulacion: number,
        estatus: "aceptada" | "rechazada",
    ) => {
        setProcesando(id_postulacion);
        try {
            await api.patch(`/postulaciones/${id_postulacion}/responder`, {
                estatus,
            });
            setMensajes((m) => ({
                ...m,
                [id_postulacion]: { ok: true, msg: `Postulación ${estatus}` },
            }));
            refetch();
        } catch (err) {
            setMensajes((m) => ({
                ...m,
                [id_postulacion]: {
                    ok: false,
                    msg: err instanceof ApiError ? err.message : "Error",
                },
            }));
        } finally {
            setProcesando(null);
        }
    };

    const pendientes =
        postulantes?.filter((p) => p.estatus === "pendiente") ?? [];
    const procesadas =
        postulantes?.filter((p) => p.estatus !== "pendiente") ?? [];

    if (loading)
        return (
            <div className="loading-state">
                <span className="spinner" />
                Cargando postulantes...
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
            <div style={{ marginBottom: "1.5rem" }}>
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate("/institucion/proyectos")}
                >
                    ← Volver a mis proyectos
                </button>
            </div>

            <div className="page-header">
                <div className="page-header-text">
                    <div className="page-header-eyebrow">
                        Gestión · Proyecto #{id}
                    </div>
                    <h1>Postulantes</h1>
                    <p className="page-header-sub">
                        {pendientes.length > 0
                            ? `${pendientes.length} pendiente${pendientes.length !== 1 ? "s" : ""} de respuesta`
                            : "Todas las postulaciones han sido atendidas"}
                    </p>
                </div>
            </div>

            {/* Stats */}
            {(postulantes?.length ?? 0) > 0 && (
                <div className="stat-grid" style={{ marginBottom: "1.5rem" }}>
                    <div className="stat-card">
                        <div className="stat-label">Total</div>
                        <div className="stat-value">
                            {postulantes?.length ?? 0}
                        </div>
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
                    <div className="stat-card accent">
                        <div className="stat-label">Aceptadas</div>
                        <div className="stat-value">
                            {postulantes?.filter(
                                (p) => p.estatus === "aceptada",
                            ).length ?? 0}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Rechazadas</div>
                        <div
                            className="stat-value"
                            style={{ color: "var(--danger)" }}
                        >
                            {postulantes?.filter(
                                (p) => p.estatus === "rechazada",
                            ).length ?? 0}
                        </div>
                    </div>
                </div>
            )}

            {postulantes?.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <div className="empty-title">Sin postulantes aún</div>
                    <p className="empty-sub">
                        Cuando los estudiantes se postulen a este proyecto,
                        aparecerán aquí.
                    </p>
                </div>
            )}

            {/* Pendientes */}
            {pendientes.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                    <h2
                        style={{
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: "1rem",
                            fontFamily: "var(--font-sans)",
                            fontWeight: 700,
                        }}
                    >
                        Pendientes de respuesta
                    </h2>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        {pendientes.map((p) => (
                            <div key={p.id_postulacion} className="card">
                                <div className="card-header">
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.75rem",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: "50%",
                                                background:
                                                    "linear-gradient(135deg,var(--teal),var(--indigo))",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontFamily:
                                                    "var(--font-display)",
                                                fontWeight: 700,
                                                fontSize: "0.875rem",
                                                color: "#0a0c0f",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {p.matricula
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    fontWeight: 600,
                                                    color: "var(--text-heading)",
                                                }}
                                            >
                                                {p.matricula}
                                            </div>
                                            <div className="text-xs text-muted">
                                                {p.email}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="badge badge-amber">
                                        ⏳ Pendiente
                                    </span>
                                </div>

                                <div style={{ marginTop: "0.75rem" }}>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() =>
                                            setCartaAbierta(
                                                cartaAbierta ===
                                                    p.id_postulacion
                                                    ? null
                                                    : p.id_postulacion,
                                            )
                                        }
                                    >
                                        {cartaAbierta === p.id_postulacion
                                            ? "▾ Ocultar carta"
                                            : "▸ Ver carta de motivación"}
                                    </button>
                                    {cartaAbierta === p.id_postulacion && (
                                        <div
                                            style={{
                                                marginTop: "0.75rem",
                                                padding: "1rem",
                                                background: "var(--surface-2)",
                                                borderRadius: "var(--radius)",
                                                border: "1px solid var(--border)",
                                                fontSize: "0.9rem",
                                                lineHeight: 1.7,
                                                color: "var(--text)",
                                            }}
                                        >
                                            {p.carta_motivacion}
                                        </div>
                                    )}
                                </div>

                                {mensajes[p.id_postulacion] && (
                                    <div
                                        className={
                                            mensajes[p.id_postulacion]!.ok
                                                ? "form-success"
                                                : "form-error"
                                        }
                                        style={{ marginTop: "0.75rem" }}
                                    >
                                        {mensajes[p.id_postulacion]!.msg}
                                    </div>
                                )}

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "0.75rem",
                                        marginTop: "1rem",
                                    }}
                                >
                                    <button
                                        className="btn btn-primary btn-sm"
                                        disabled={
                                            procesando === p.id_postulacion
                                        }
                                        onClick={() =>
                                            responder(
                                                p.id_postulacion,
                                                "aceptada",
                                            )
                                        }
                                    >
                                        {procesando === p.id_postulacion ? (
                                            <span
                                                className="spinner"
                                                style={{
                                                    width: 12,
                                                    height: 12,
                                                    borderWidth: 2,
                                                }}
                                            />
                                        ) : (
                                            "✓"
                                        )}{" "}
                                        Aceptar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        disabled={
                                            procesando === p.id_postulacion
                                        }
                                        onClick={() =>
                                            responder(
                                                p.id_postulacion,
                                                "rechazada",
                                            )
                                        }
                                    >
                                        ✕ Rechazar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Procesadas */}
            {procesadas.length > 0 && (
                <div>
                    <h2
                        style={{
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: "1rem",
                            fontFamily: "var(--font-sans)",
                            fontWeight: 700,
                        }}
                    >
                        Postulaciones atendidas
                    </h2>
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Estudiante</th>
                                    <th>Email</th>
                                    <th>Estatus</th>
                                </tr>
                            </thead>
                            <tbody>
                                {procesadas.map((p) => (
                                    <tr key={p.id_postulacion}>
                                        <td
                                            style={{
                                                fontWeight: 500,
                                                color: "var(--text-heading)",
                                            }}
                                        >
                                            {p.matricula}
                                        </td>
                                        <td className="text-muted text-sm">
                                            {p.email}
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${estatusBadge(p.estatus)}`}
                                            >
                                                {p.estatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
