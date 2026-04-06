import { useState, type FormEvent } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/api/client";

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const mensaje = (location.state as { mensaje?: string } | null)?.mensaje;

    const [matricula, setMatricula] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(matricula, password);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err instanceof ApiError
                    ? err.message
                    : "Error al iniciar sesión",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            <div className="auth-panel">
                <div className="auth-box">
                    <div className="auth-logo">
                        <div className="auth-logo-mark">SS</div>
                        <div className="auth-logo-text">
                            AWOS<span>·SS</span>
                        </div>
                    </div>

                    <h1 className="auth-title">Bienvenido</h1>
                    <p className="auth-sub">
                        Accede a tu cuenta para continuar.
                    </p>

                    {mensaje && (
                        <div
                            className="form-success"
                            style={{ marginBottom: "1rem" }}
                        >
                            ✓ {mensaje}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="matricula">
                                Matrícula
                            </label>
                            <input
                                id="matricula"
                                className="form-input"
                                type="text"
                                value={matricula}
                                onChange={(e) => setMatricula(e.target.value)}
                                placeholder="Ej. A12345678"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                className="form-input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
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
                                    Ingresando...
                                </>
                            ) : (
                                "Iniciar sesión"
                            )}
                        </button>
                    </form>

                    <div className="auth-links">
                        ¿No tienes cuenta?{" "}
                        <Link to="/registro/estudiante">
                            Regístrate como estudiante
                        </Link>
                        {" · "}
                        <Link to="/registro/institucion">
                            Registrar institución
                        </Link>
                    </div>
                </div>
            </div>

            <div className="auth-side">
                <h2 className="auth-side-title">
                    Marketplace de Servicio Social
                </h2>
                <p className="auth-side-sub">
                    Conecta tu talento con instituciones que generan impacto.
                </p>
                <div className="auth-feature-list">
                    <div className="auth-feature">
                        <div className="auth-feature-icon teal">🗺️</div>
                        <div className="auth-feature-text">
                            <h4>Explora por mapa</h4>
                            <p>
                                Filtra proyectos por distancia, modalidad y área
                                de conocimiento.
                            </p>
                        </div>
                    </div>
                    <div className="auth-feature">
                        <div className="auth-feature-icon indigo">📋</div>
                        <div className="auth-feature-text">
                            <h4>Kardex digital</h4>
                            <p>
                                Registra y valida tus horas de trabajo con
                                evidencia auditable.
                            </p>
                        </div>
                    </div>
                    <div className="auth-feature">
                        <div className="auth-feature-icon amber">🏛️</div>
                        <div className="auth-feature-text">
                            <h4>Instituciones verificadas</h4>
                            <p>
                                Trabaja con ONGs, empresas y organismos públicos
                                de todo el país.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
