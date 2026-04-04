import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/api/client";

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

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
        <main>
            <h1>Iniciar sesión</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="matricula">Matrícula</label>
                    <input
                        id="matricula"
                        type="text"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        required
                        autoFocus
                    />
                </div>

                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && (
                    <p role="alert" style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Entrar"}
                </button>
            </form>

            <p>
                ¿No tienes cuenta?{" "}
                <Link to="/registro/estudiante">
                    Regístrate como estudiante
                </Link>
                {" | "}
                <Link to="/registro/institucion">Registrar institución</Link>
            </p>
        </main>
    );
}
