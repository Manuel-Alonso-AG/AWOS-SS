import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import type { VistaKardexSS } from "@awos-ss/types";

function RingProgress({ pct }: { pct: number }) {
    const r = 42;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    const color = pct >= 100 ? "#4cce8e" : pct >= 50 ? "#63d4b1" : "#f5a623";
    return (
        <div className="kardex-ring">
            <svg
                className="kardex-ring-svg"
                width="100"
                height="100"
                viewBox="0 0 100 100"
            >
                <circle
                    cx="50"
                    cy="50"
                    r={r}
                    fill="none"
                    stroke="var(--surface-3)"
                    strokeWidth="8"
                />
                <circle
                    cx="50"
                    cy="50"
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeDasharray={`${dash} ${circ - dash}`}
                    strokeLinecap="round"
                    style={{
                        transition:
                            "stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1)",
                    }}
                />
            </svg>
            <div className="kardex-ring-text">
                <span className="kardex-ring-pct">{pct}%</span>
                <span className="kardex-ring-label">avance</span>
            </div>
        </div>
    );
}

export function KardexPage() {
    const { usuario } = useAuth();
    const {
        data: kardex,
        loading,
        error,
    } = useFetch<VistaKardexSS[]>(
        usuario ? `/horas/kardex/${usuario.matricula}` : null,
    );

    const totalValidadas =
        kardex?.reduce((a, k) => a + k.horas_validadas, 0) ?? 0;
    const totalRegistradas =
        kardex?.reduce((a, k) => a + k.horas_registradas, 0) ?? 0;
    const totalPendientes =
        kardex?.reduce((a, k) => a + k.horas_pendientes, 0) ?? 0;
    const totalRequeridas =
        kardex?.reduce((a, k) => a + k.horas_requeridas, 0) ?? 0;
    const globalPct =
        totalRequeridas > 0
            ? Math.min(
                  Math.round((totalValidadas / totalRequeridas) * 100),
                  100,
              )
            : 0;

    if (loading)
        return (
            <div className="loading-state">
                <span className="spinner" />
                Cargando kardex...
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
                    <h1>Kardex de Servicio Social</h1>
                    <p className="page-header-sub">
                        Matrícula:{" "}
                        <strong style={{ color: "var(--text-heading)" }}>
                            {usuario?.matricula}
                        </strong>
                    </p>
                </div>
            </div>

            {/* Global summary */}
            <div className="kardex-global">
                <RingProgress pct={globalPct} />
                <div className="kardex-global-info">
                    <div className="kardex-global-title">Progreso global</div>
                    <div className="kardex-global-sub">
                        {kardex?.length ?? 0} proyecto
                        {kardex?.length !== 1 ? "s" : ""} en tu kardex
                    </div>
                    <div className="progress-wrap" style={{ maxWidth: 400 }}>
                        <div className="progress-label">
                            <span>Horas validadas / requeridas</span>
                            <span>
                                {totalValidadas} / {totalRequeridas} h
                            </span>
                        </div>
                        <div className="progress-track">
                            <div
                                className="progress-bar"
                                style={{
                                    width: `${Math.min(globalPct, 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div
                    className="stat-grid"
                    style={{
                        margin: 0,
                        gridTemplateColumns: "repeat(3,1fr)",
                        gap: "0.75rem",
                    }}
                >
                    <div className="stat-card accent">
                        <div className="stat-label">Validadas</div>
                        <div className="stat-value">{totalValidadas}</div>
                        <div className="stat-sub">horas</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Pendientes</div>
                        <div
                            className="stat-value"
                            style={{ color: "var(--warning)" }}
                        >
                            {totalPendientes}
                        </div>
                        <div className="stat-sub">horas</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Registradas</div>
                        <div className="stat-value">{totalRegistradas}</div>
                        <div className="stat-sub">horas</div>
                    </div>
                </div>
            </div>

            {kardex?.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🏆</div>
                    <div className="empty-title">Tu kardex está vacío</div>
                    <p className="empty-sub">
                        Postúlate a proyectos y registra horas para ver tu
                        avance aquí.
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

            {kardex && kardex.length > 0 && (
                <div className="grid grid-auto">
                    {kardex.map((k) => {
                        const pct = Math.min(k.porcentaje_avance, 100);
                        const completado = pct >= 100;
                        return (
                            <div
                                key={k.id_proyecto}
                                className={`card ${completado ? "card-accent" : ""}`}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1rem",
                                }}
                            >
                                <div>
                                    {completado && (
                                        <div
                                            className="badge badge-green"
                                            style={{ marginBottom: "0.5rem" }}
                                        >
                                            ✓ Completado
                                        </div>
                                    )}
                                    <h3 style={{ marginBottom: "0.25rem" }}>
                                        {k.titulo}
                                    </h3>
                                    <p className="text-muted text-sm">
                                        🏛️ {k.institucion}
                                    </p>
                                    <span
                                        className="badge badge-gray"
                                        style={{
                                            marginTop: "0.375rem",
                                            fontSize: "0.7rem",
                                        }}
                                    >
                                        {k.area}
                                    </span>
                                </div>

                                <div className="progress-wrap">
                                    <div className="progress-label">
                                        <span>Progreso</span>
                                        <span>{pct}%</span>
                                    </div>
                                    <div className="progress-track">
                                        <div
                                            className={`progress-bar ${pct < 30 ? "danger" : pct < 60 ? "warning" : ""}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(4,1fr)",
                                        gap: "0.5rem",
                                    }}
                                >
                                    {[
                                        {
                                            label: "Requeridas",
                                            val: `${k.horas_requeridas}h`,
                                            col: "var(--text-heading)",
                                        },
                                        {
                                            label: "Registradas",
                                            val: `${k.horas_registradas}h`,
                                            col: "var(--text-heading)",
                                        },
                                        {
                                            label: "Validadas",
                                            val: `${k.horas_validadas}h`,
                                            col: "var(--success)",
                                        },
                                        {
                                            label: "Pendientes",
                                            val: `${k.horas_pendientes}h`,
                                            col: "var(--warning)",
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            style={{
                                                background: "var(--surface-2)",
                                                borderRadius: "var(--radius)",
                                                padding: "0.5rem 0.375rem",
                                                textAlign: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "1rem",
                                                    fontWeight: 700,
                                                    fontFamily:
                                                        "var(--font-display)",
                                                    color: item.col,
                                                    lineHeight: 1.1,
                                                }}
                                            >
                                                {item.val}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "0.65rem",
                                                    color: "var(--text-muted)",
                                                    marginTop: "0.15rem",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.06em",
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
