import { useFetch } from "@/hooks/useFetch";
import { api, ApiError } from "@/api/client";
import { useState } from "react";

interface RegistroPendiente {
    id_registro: number;
    matricula: string;
    proyecto: string;
    fecha_actividad: string;
    horas: number;
    descripcion: string;
    evidencia_url: string;
}

export function ValidarHorasPage() {
    const {
        data: pendientes,
        loading,
        error,
        refetch,
    } = useFetch<RegistroPendiente[]>("/horas/pendientes");
    const [procesando, setProcesando] = useState<number | null>(null);
    const [mensajes, setMensajes] = useState<
        Record<number, { ok: boolean; msg: string }>
    >({});

    const validar = async (id_registro: number, validado: boolean) => {
        setProcesando(id_registro);
        try {
            await api.patch(`/horas/${id_registro}/validar`, { validado });
            setMensajes((m) => ({
                ...m,
                [id_registro]: {
                    ok: true,
                    msg: validado ? "Horas validadas ✓" : "Horas rechazadas",
                },
            }));
            refetch();
        } catch (err) {
            setMensajes((m) => ({
                ...m,
                [id_registro]: {
                    ok: false,
                    msg: err instanceof ApiError ? err.message : "Error",
                },
            }));
        } finally {
            setProcesando(null);
        }
    };

    const formatFecha = (f: string) => {
        try {
            return new Date(f).toLocaleDateString("es-MX", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        } catch {
            return f;
        }
    };

    if (loading)
        return (
            <div className="loading-state">
                <span className="spinner" />
                Cargando registros...
            </div>
        );
    if (error)
        return (
            <div className="form-error" style={{ marginTop: "2rem" }}>
                ⚠ {error}
            </div>
        );

    // Split processed (in mensajes) vs unprocessed
    const sinProcesar =
        pendientes?.filter((r) => !mensajes[r.id_registro]) ?? [];
    const procesados = pendientes?.filter((r) => mensajes[r.id_registro]) ?? [];

    return (
        <>
            <div className="page-header">
                <div className="page-header-text">
                    <div className="page-header-eyebrow">Gestión</div>
                    <h1>Validar horas pendientes</h1>
                    <p className="page-header-sub">
                        {sinProcesar.length > 0
                            ? `${sinProcesar.length} registro${sinProcesar.length !== 1 ? "s" : ""} esperando revisión`
                            : "Todo al día · No hay horas pendientes"}
                    </p>
                </div>
            </div>

            {pendientes?.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon" style={{ fontSize: "2rem" }}>
                        ✅
                    </div>
                    <div className="empty-title">Sin pendientes</div>
                    <p className="empty-sub">
                        No hay horas de trabajo pendientes de validación.
                        ¡Excelente gestión!
                    </p>
                </div>
            )}

            {sinProcesar.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        marginBottom: "2rem",
                    }}
                >
                    {sinProcesar.map((r) => (
                        <div
                            key={r.id_registro}
                            className="card"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                            }}
                        >
                            {/* Header */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    gap: "1rem",
                                    flexWrap: "wrap",
                                }}
                            >
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
                                            fontFamily: "var(--font-display)",
                                            fontWeight: 700,
                                            fontSize: "0.875rem",
                                            color: "#0a0c0f",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {r.matricula
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
                                            {r.matricula}
                                        </div>
                                        <div className="text-xs text-muted">
                                            {r.proyecto}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "0.5rem",
                                        alignItems: "center",
                                    }}
                                >
                                    <span className="badge badge-amber">
                                        ⏳ Pendiente
                                    </span>
                                    <span
                                        className="badge badge-blue"
                                        style={{
                                            fontSize: "0.875rem",
                                            fontFamily: "var(--font-display)",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {r.horas}h
                                    </span>
                                </div>
                            </div>

                            {/* Details */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit,minmax(180px,1fr))",
                                    gap: "0.75rem",
                                }}
                            >
                                <div
                                    style={{
                                        padding: "0.75rem",
                                        background: "var(--surface-2)",
                                        borderRadius: "var(--radius)",
                                        border: "1px solid var(--border)",
                                    }}
                                >
                                    <div
                                        className="text-xs text-muted"
                                        style={{
                                            marginBottom: "0.25rem",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.06em",
                                        }}
                                    >
                                        Fecha
                                    </div>
                                    <div
                                        style={{
                                            fontWeight: 500,
                                            color: "var(--text-heading)",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {formatFecha(r.fecha_actividad)}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        padding: "0.75rem",
                                        background: "var(--surface-2)",
                                        borderRadius: "var(--radius)",
                                        border: "1px solid var(--border)",
                                        gridColumn: "span 2",
                                    }}
                                >
                                    <div
                                        className="text-xs text-muted"
                                        style={{
                                            marginBottom: "0.25rem",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.06em",
                                        }}
                                    >
                                        Actividades realizadas
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "0.9rem",
                                            lineHeight: 1.6,
                                            color: "var(--text)",
                                        }}
                                    >
                                        {r.descripcion}
                                    </div>
                                </div>
                            </div>

                            {/* Evidence */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    padding: "0.625rem 0.875rem",
                                    background: "var(--surface-2)",
                                    borderRadius: "var(--radius)",
                                    border: "1px solid var(--border)",
                                }}
                            >
                                <span
                                    className="text-xs text-muted"
                                    style={{
                                        textTransform: "uppercase",
                                        letterSpacing: "0.06em",
                                        flexShrink: 0,
                                    }}
                                >
                                    Evidencia:
                                </span>
                                <a
                                    href={r.evidencia_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent text-sm"
                                    style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        flex: 1,
                                    }}
                                >
                                    🔗 {r.evidencia_url}
                                </a>
                            </div>

                            {/* Actions */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.75rem",
                                    paddingTop: "0.25rem",
                                }}
                            >
                                <button
                                    className="btn btn-primary btn-sm"
                                    disabled={procesando === r.id_registro}
                                    onClick={() => validar(r.id_registro, true)}
                                >
                                    {procesando === r.id_registro ? (
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
                                    Validar horas
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    disabled={procesando === r.id_registro}
                                    onClick={() =>
                                        validar(r.id_registro, false)
                                    }
                                >
                                    ✕ Rechazar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Processed this session */}
            {procesados.length > 0 && (
                <section>
                    <h2
                        style={{
                            marginBottom: "1rem",
                            fontSize: "0.875rem",
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontFamily: "var(--font-sans)",
                        }}
                    >
                        Procesados en esta sesión
                    </h2>
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Estudiante</th>
                                    <th>Proyecto</th>
                                    <th>Fecha</th>
                                    <th>Horas</th>
                                    <th>Resultado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {procesados.map((r) => (
                                    <tr key={r.id_registro}>
                                        <td
                                            style={{
                                                fontWeight: 500,
                                                color: "var(--text-heading)",
                                            }}
                                        >
                                            {r.matricula}
                                        </td>
                                        <td className="text-muted text-sm">
                                            {r.proyecto}
                                        </td>
                                        <td className="text-sm">
                                            {formatFecha(r.fecha_actividad)}
                                        </td>
                                        <td>
                                            <span className="badge badge-blue">
                                                {r.horas}h
                                            </span>
                                        </td>
                                        <td>
                                            <div
                                                className={
                                                    mensajes[r.id_registro]
                                                        ?.ok &&
                                                    mensajes[
                                                        r.id_registro
                                                    ]?.msg.includes("valid")
                                                        ? "form-success"
                                                        : "form-error"
                                                }
                                                style={{
                                                    padding: "0.25rem 0.625rem",
                                                    display: "inline-flex",
                                                    borderRadius: 99,
                                                    fontSize: "0.8rem",
                                                }}
                                            >
                                                {mensajes[r.id_registro]?.msg}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </>
    );
}
