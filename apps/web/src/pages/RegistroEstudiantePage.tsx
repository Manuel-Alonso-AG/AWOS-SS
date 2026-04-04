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
                state: { mensaje: "Registro exitoso. Inicia sesión." },
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
        <main>
            <h1>Registro de estudiante</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="matricula">Matrícula</label>
                    <input
                        id="matricula"
                        type="text"
                        value={form.matricula}
                        onChange={set("matricula")}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        value={form.password}
                        onChange={set("password")}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmar">Confirmar contraseña</label>
                    <input
                        id="confirmar"
                        type="password"
                        value={form.confirmar}
                        onChange={set("confirmar")}
                        required
                    />
                </div>

                {error && (
                    <p role="alert" style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Registrando..." : "Crear cuenta"}
                </button>
            </form>

            <p>
                <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
            </p>
        </main>
    );
}
