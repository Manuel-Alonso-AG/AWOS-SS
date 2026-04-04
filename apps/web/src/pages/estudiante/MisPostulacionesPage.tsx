import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { api, ApiError } from "@/api/client";

interface PostulacionConHoras {
    id_postulacion: number;
    id_proyecto: number;
    titulo: string;
    modalidad: string;
    horas_requeridas: number;
    institucion: string;
    estatus: string;
    horas_registradas: number;
    horas_validadas: number;
}

export function MisPostulacionesPage() {
    const {
        data: postulaciones,
        loading,
        error,
        refetch,
    } = useFetch<PostulacionConHoras[]>("/postulaciones/mis");

    // Estado del formulario de registro de horas
    const [postulacionSeleccionada, setPostulacionSeleccionada] = useState<
        number | null
    >(null);
    const [horasForm, setHorasForm] = useState({
        fecha_actividad: "",
        horas: "",
        descripcion: "",
        evidencia_url: "",
    });
    const [registrando, setRegistrando] = useState(false);
    const [mensajeOk, setMensajeOk] = useState("");
    const [mensajeErr, setMensajeErr] = useState("");

    const set =
        (f: string) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setHorasForm((prev) => ({ ...prev, [f]: e.target.value }));

    const registrarHoras = async () => {
        if (!postulacionSeleccionada) return;
        const { fecha_actividad, horas, descripcion, evidencia_url } =
            horasForm;
        if (!fecha_actividad || !horas || !descripcion || !evidencia_url) {
            setMensajeErr("Todos los campos son obligatorios");
            return;
        }
        setRegistrando(true);
        setMensajeErr("");
        try {
            await api.post("/horas", {
                id_postulacion: postulacionSeleccionada,
                fecha_actividad,
                horas: Number(horas),
                descripcion,
                evidencia_url,
            });
            setMensajeOk(
                "Horas registradas. Pendientes de validación por la institución.",
            );
            setHorasForm({
                fecha_actividad: "",
                horas: "",
                descripcion: "",
                evidencia_url: "",
            });
            setPostulacionSeleccionada(null);
            refetch();
        } catch (err) {
            setMensajeErr(
                err instanceof ApiError ? err.message : "Error al registrar",
            );
        } finally {
            setRegistrando(false);
        }
    };

    if (loading) return <p>Cargando postulaciones...</p>;
    if (error)
        return (
            <p role="alert" style={{ color: "red" }}>
                {error}
            </p>
        );

    return (
        <main>
            <h1>Mis postulaciones</h1>

            {postulaciones?.length === 0 && <p>Aún no tienes postulaciones.</p>}

            {postulaciones?.map((p) => (
                <article key={p.id_postulacion}>
                    <h2>{p.titulo}</h2>
                    <p>
                        {p.institucion} · {p.modalidad}
                    </p>
                    <p>
                        Estatus: <strong>{p.estatus}</strong>
                    </p>
                    <p>
                        Horas: {p.horas_validadas} validadas /{" "}
                        {p.horas_registradas} registradas / {p.horas_requeridas}{" "}
                        requeridas
                    </p>

                    {p.estatus === "aceptada" && (
                        <button
                            type="button"
                            onClick={() => {
                                setPostulacionSeleccionada(p.id_postulacion);
                                setMensajeOk("");
                                setMensajeErr("");
                            }}
                        >
                            + Registrar horas
                        </button>
                    )}
                </article>
            ))}

            {/* ── Modal de registro de horas ── */}
            {postulacionSeleccionada !== null && (
                <section aria-label="Registrar horas">
                    <h2>
                        Registrar horas — postulación #{postulacionSeleccionada}
                    </h2>

                    <div>
                        <label htmlFor="fecha">Fecha de actividad</label>
                        <input
                            id="fecha"
                            type="date"
                            value={horasForm.fecha_actividad}
                            onChange={set("fecha_actividad")}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="horas">Horas (0.5 – 12)</label>
                        <input
                            id="horas"
                            type="number"
                            min={0.5}
                            max={12}
                            step={0.5}
                            value={horasForm.horas}
                            onChange={set("horas")}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="descripcion">
                            Descripción de actividades
                        </label>
                        <textarea
                            id="descripcion"
                            rows={3}
                            value={horasForm.descripcion}
                            onChange={set("descripcion")}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="evidencia">
                            URL de evidencia (Drive, GitHub, etc.)
                        </label>
                        <input
                            id="evidencia"
                            type="url"
                            value={horasForm.evidencia_url}
                            onChange={set("evidencia_url")}
                            required
                        />
                    </div>

                    {mensajeOk && <p style={{ color: "green" }}>{mensajeOk}</p>}
                    {mensajeErr && (
                        <p role="alert" style={{ color: "red" }}>
                            {mensajeErr}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={registrarHoras}
                        disabled={registrando}
                    >
                        {registrando ? "Registrando..." : "Guardar horas"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setPostulacionSeleccionada(null)}
                    >
                        Cancelar
                    </button>
                </section>
            )}
        </main>
    );
}
