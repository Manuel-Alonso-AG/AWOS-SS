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
                state: { mensaje: "Institución registrada. Inicia sesión." },
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
        <main>
            <h1>Registro de institución</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="matricula">Identificador / Matrícula</label>
                    <input
                        id="matricula"
                        type="text"
                        value={form.matricula}
                        onChange={set("matricula")}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Correo institucional</label>
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
                <div>
                    <label htmlFor="nombre_legal">
                        Nombre legal de la institución
                    </label>
                    <input
                        id="nombre_legal"
                        type="text"
                        value={form.nombre_legal}
                        onChange={set("nombre_legal")}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="tipo">Tipo de institución</label>
                    <select
                        id="tipo"
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
                <div>
                    <label htmlFor="direccion">
                        Dirección (para geocodificación)
                    </label>
                    <input
                        id="direccion"
                        type="text"
                        value={form.direccion}
                        onChange={set("direccion")}
                        placeholder="Calle, número, colonia, ciudad, estado"
                        required
                    />
                </div>

                {error && (
                    <p role="alert" style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading
                        ? "Registrando... (geocodificando dirección)"
                        : "Registrar institución"}
                </button>
            </form>

            <p>
                <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
            </p>
        </main>
    );
}
