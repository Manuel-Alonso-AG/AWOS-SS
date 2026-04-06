import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, ApiError } from "@/api/client";

export function RegistroInstitucionPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        matricula: "",
        email: "",
        password: "",
        confirmar: "",
        nombre_legal: "",
        tipo: "",
        direccion: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const set =
        (field: string) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        if (form.password !== form.confirmar) {
            setError("Las contraseñas no coinciden");
            return;
        }
        if (form.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }
        setLoading(true);
        try {
            await api.post(
                "/auth/registro/institucion",
                {
                    matricula: form.matricula,
                    email: form.email,
                    password: form.password,
                    nombre_legal: form.nombre_legal,
                    tipo: form.tipo,
                    direccion: form.direccion,
                },
                false,
            );
            navigate("/login", {
                state: {
                    mensaje:
                        "Institución registrada exitosamente. Inicia sesión.",
                },
            });
        } catch (err) {
            setError(
                err instanceof ApiError
                    ? err.message
                    : "Error al registrar institución",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            <div className="auth-panel">
                <div className="auth-box" style={{ maxWidth: 480 }}>
                    <div className="auth-logo">
                        <div className="auth-logo-mark">SS</div>
                        <div className="auth-logo-text">
                            AWOS<span>·SS</span>
                        </div>
                    </div>
                    <h1 className="auth-title">Registrar institución</h1>
                    <p className="auth-sub">
                        Publica proyectos y conecta con estudiantes listos para
                        el servicio social.
                    </p>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div
                            style={{
                                padding: "0.75rem 0.875rem",
                                background: "var(--surface-2)",
                                borderRadius: "var(--radius)",
                                border: "1px solid var(--border)",
                                marginBottom: "0.25rem",
                            }}
                        >
                            <p
                                className="text-xs text-muted"
                                style={{
                                    margin: 0,
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    marginBottom: "0.375rem",
                                }}
                            >
                                Datos de acceso
                            </p>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="matricula">
                                Identificador / Matrícula
                            </label>
                            <input
                                id="matricula"
                                className="form-input"
                                type="text"
                                value={form.matricula}
                                onChange={set("matricula")}
                                placeholder="Ej. INST001"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Correo institucional
                            </label>
                            <input
                                id="email"
                                className="form-input"
                                type="email"
                                value={form.email}
                                onChange={set("email")}
                                placeholder="contacto@institucion.org"
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label
                                    className="form-label"
                                    htmlFor="password"
                                >
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    className="form-input"
                                    type="password"
                                    value={form.password}
                                    onChange={set("password")}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label
                                    className="form-label"
                                    htmlFor="confirmar"
                                >
                                    Confirmar
                                </label>
                                <input
                                    id="confirmar"
                                    className="form-input"
                                    type="password"
                                    value={form.confirmar}
                                    onChange={set("confirmar")}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div
                            style={{
                                padding: "0.75rem 0.875rem",
                                background: "var(--surface-2)",
                                borderRadius: "var(--radius)",
                                border: "1px solid var(--border)",
                                marginBottom: "0.25rem",
                                marginTop: "0.5rem",
                            }}
                        >
                            <p
                                className="text-xs text-muted"
                                style={{
                                    margin: 0,
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    marginBottom: "0.375rem",
                                }}
                            >
                                Datos de la institución
                            </p>
                        </div>
                        <div className="form-group">
                            <label
                                className="form-label"
                                htmlFor="nombre_legal"
                            >
                                Nombre legal de la institución
                            </label>
                            <input
                                id="nombre_legal"
                                className="form-input"
                                type="text"
                                value={form.nombre_legal}
                                onChange={set("nombre_legal")}
                                placeholder="Ej. Cruz Roja Mexicana Delegación Morelos"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="tipo">
                                Tipo de institución
                            </label>
                            <select
                                id="tipo"
                                className="form-select"
                                value={form.tipo}
                                onChange={set("tipo")}
                                required
                            >
                                <option value="">Selecciona...</option>
                                <option value="publica">Pública</option>
                                <option value="privada">Privada</option>
                                <option value="ong">ONG</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="direccion">
                                Dirección{" "}
                                <span
                                    style={{
                                        color: "var(--accent)",
                                        fontWeight: 400,
                                    }}
                                >
                                    (geocodificación automática)
                                </span>
                            </label>
                            <input
                                id="direccion"
                                className="form-input"
                                type="text"
                                value={form.direccion}
                                onChange={set("direccion")}
                                placeholder="Calle, número, colonia, ciudad, estado"
                                required
                            />
                            <small>
                                Tu dirección se convertirá en coordenadas para
                                aparecer en el mapa.
                            </small>
                        </div>

                        {error && <div className="form-error">⚠ {error}</div>}
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner"
                                        style={{
                                            width: 16,
                                            height: 16,
                                            borderWidth: 2,
                                        }}
                                    />
                                    Registrando y geocodificando...
                                </>
                            ) : (
                                "Registrar institución"
                            )}
                        </button>
                    </form>

                    <div className="auth-links">
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/login">Inicia sesión</Link>
                        {" · "}
                        <Link to="/registro/estudiante">
                            Registrarse como estudiante
                        </Link>
                    </div>
                </div>
            </div>

            <div className="auth-side">
                <h2 className="auth-side-title">
                    Conecta con estudiantes talentosos
                </h2>
                <p className="auth-side-sub">
                    Publica proyectos y gestiona el servicio social de forma
                    digital.
                </p>
                <div className="auth-feature-list">
                    <div className="auth-feature">
                        <div className="auth-feature-icon teal">📍</div>
                        <div className="auth-feature-text">
                            <h4>Geolocalización automática</h4>
                            <p>
                                Tu institución y proyectos aparecen en el mapa
                                interactivo para todos los estudiantes.
                            </p>
                        </div>
                    </div>
                    <div className="auth-feature">
                        <div className="auth-feature-icon indigo">👥</div>
                        <div className="auth-feature-text">
                            <h4>Gestión de postulantes</h4>
                            <p>
                                Acepta o rechaza postulaciones y valida las
                                horas de trabajo de cada estudiante.
                            </p>
                        </div>
                    </div>
                    <div className="auth-feature">
                        <div className="auth-feature-icon amber">📊</div>
                        <div className="auth-feature-text">
                            <h4>Seguimiento en tiempo real</h4>
                            <p>
                                Consulta el avance de cada estudiante con kardex
                                digital y reportes automáticos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
