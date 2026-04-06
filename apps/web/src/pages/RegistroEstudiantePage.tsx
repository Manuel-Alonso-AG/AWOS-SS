import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, ApiError } from "@/api/client";

export function RegistroEstudiantePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        matricula: "",
        email: "",
        password: "",
        confirmar: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
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
                "/auth/registro/estudiante",
                {
                    matricula: form.matricula,
                    email: form.email,
                    password: form.password,
                },
                false,
            );
            navigate("/login", {
                state: {
                    mensaje: "Registro exitoso. Inicia sesión para continuar.",
                },
            });
        } catch (err) {
            setError(
                err instanceof ApiError ? err.message : "Error al registrarse",
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
                    <h1 className="auth-title">Crea tu cuenta</h1>
                    <p className="auth-sub">
                        Regístrate como estudiante para explorar proyectos de
                        servicio social.
                    </p>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="matricula">
                                Matrícula
                            </label>
                            <input
                                id="matricula"
                                className="form-input"
                                type="text"
                                value={form.matricula}
                                onChange={set("matricula")}
                                placeholder="Ej. AGAO241496"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                className="form-input"
                                type="email"
                                value={form.email}
                                onChange={set("email")}
                                placeholder="correo@ejemplo.com"
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
                                    Creando cuenta...
                                </>
                            ) : (
                                "Crear cuenta de estudiante"
                            )}
                        </button>
                    </form>

                    <div className="auth-links">
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/login">Inicia sesión</Link>
                        {" · "}
                        <Link to="/registro/institucion">
                            Registrar institución
                        </Link>
                    </div>
                </div>
            </div>

            <div className="auth-side">
                <h2 className="auth-side-title">
                    Empieza tu servicio social hoy
                </h2>
                <p className="auth-side-sub">
                    Conecta con instituciones que buscan tu talento.
                </p>
                <div className="auth-feature-list">
                    <div className="auth-feature">
                        <div className="auth-feature-icon teal">🗺️</div>
                        <div className="auth-feature-text">
                            <h4>Proyectos geolocalizados</h4>
                            <p>
                                Filtra por distancia, área y modalidad para
                                encontrar el proyecto ideal.
                            </p>
                        </div>
                    </div>
                    <div className="auth-feature">
                        <div className="auth-feature-icon indigo">📋</div>
                        <div className="auth-feature-text">
                            <h4>Kardex digital</h4>
                            <p>
                                Registra y valida tus horas con evidencia
                                auditable en tiempo real.
                            </p>
                        </div>
                    </div>
                    <div className="auth-feature">
                        <div className="auth-feature-icon amber">🏛️</div>
                        <div className="auth-feature-text">
                            <h4>Instituciones verificadas</h4>
                            <p>
                                ONGs, empresas y organismos públicos de todo el
                                país.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
