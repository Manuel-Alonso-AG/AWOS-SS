// Resumen global de postulaciones pendientes de la institución
// (redirige a mis-proyectos con filtro visual de pendientes)
import { useFetch } from "@/hooks/useFetch";
import { Link } from "react-router-dom";

interface ProyectoConPost {
    id_proyecto: number;
    titulo: string;
    modalidad: string;
    estatus: string;
    total_postulaciones: number;
    plazas_total: number;
    plazas_ocupadas: number;
}

export function PostulacionesOverviewPage() {
    const {
        data: proyectos,
        loading,
        error,
    } = useFetch<ProyectoConPost[]>("/proyectos/mis-proyectos");

    const conPostulaciones =
        proyectos?.filter((p) => p.total_postulaciones > 0) ?? [];
    const totalPendientes = conPostulaciones.reduce(
        (a, p) => a + p.total_postulaciones,
        0,
    );

    if (loading)
        return (
            <div className="loading-state">
                <span className="spinner" />
                Cargando...
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
                    <div className="page-header-eyebrow">Gestión</div>
                    <h1>Postulaciones recibidas</h1>
                    <p className="page-header-sub">
                        {totalPendientes} postulación
                        {totalPendientes !== 1 ? "es" : ""} en total
                    </p>
                </div>
            </div>

            {conPostulaciones.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <div className="empty-title">Sin postulaciones</div>
                    <p className="empty-sub">
                        Cuando los estudiantes se postulen a tus proyectos,
                        aparecerán aquí.
                    </p>
                    <Link
                        to="/institucion/proyectos"
                        className="btn btn-primary"
                        style={{ marginTop: "0.5rem" }}
                    >
                        Ver mis proyectos
                    </Link>
                </div>
            )}

            {conPostulaciones.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                    }}
                >
                    {conPostulaciones.map((p) => (
                        <div
                            key={p.id_proyecto}
                            className="card"
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: "1rem",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontWeight: 600,
                                        color: "var(--text-heading)",
                                        marginBottom: "0.2rem",
                                    }}
                                >
                                    {p.titulo}
                                </div>
                                <div
                                    className="text-xs text-muted"
                                    style={{ textTransform: "capitalize" }}
                                >
                                    {p.modalidad} · {p.estatus}
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                }}
                            >
                                <span className="badge badge-blue">
                                    {p.total_postulaciones} postulante
                                    {p.total_postulaciones !== 1 ? "s" : ""}
                                </span>
                                <Link
                                    to={`/institucion/proyectos/${p.id_proyecto}/postulaciones`}
                                    className="btn btn-secondary btn-sm"
                                >
                                    Revisar →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
