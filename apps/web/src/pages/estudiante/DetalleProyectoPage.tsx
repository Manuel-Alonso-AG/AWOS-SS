import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, ApiError } from "@/api/client";
import { useFetch } from "@/hooks/useFetch";
import type { Proyecto } from "@awos-ss/types";

export function DetalleProyectoPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        data: proyecto,
        loading,
        error,
    } = useFetch<Proyecto>(id ? `/proyectos/${id}` : null);

    const [carta, setCarta] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [mensajeOk, setMensajeOk] = useState("");
    const [mensajeErr, setMensajeErr] = useState("");

    const postularse = async () => {
        if (!carta.trim()) {
            setMensajeErr("Escribe una carta de motivación");
            return;
        }
        setEnviando(true);
        setMensajeErr("");
        try {
            await api.post("/postulaciones", {
                id_proyecto: Number(id),
                carta_motivacion: carta,
            });
            setMensajeOk("¡Postulación enviada exitosamente!");
            setCarta("");
        } catch (err) {
            setMensajeErr(
                err instanceof ApiError ? err.message : "Error al postularse",
            );
        } finally {
            setEnviando(false);
        }
    };

    if (loading) return <p>Cargando proyecto...</p>;
    if (error)
        return (
            <p role="alert" style={{ color: "red" }}>
                {error}
            </p>
        );
    if (!proyecto) return null;

    return (
        <main>
            <button type="button" onClick={() => navigate(-1)}>
                ← Volver
            </button>

            <h1>{proyecto.titulo}</h1>
            <p>Modalidad: {proyecto.modalidad}</p>
            <p>Horas requeridas: {proyecto.horas_requeridas}</p>
            <p>
                Plazas disponibles:{" "}
                {proyecto.plazas_total - proyecto.plazas_ocupadas} /{" "}
                {proyecto.plazas_total}
            </p>
            <p>Estatus: {proyecto.estatus}</p>
            <p>Dirección: {proyecto.direccion_proyecto}</p>

            {proyecto.estatus === "publicado" && (
                <section>
                    <h2>Postularme a este proyecto</h2>
                    <label htmlFor="carta">Carta de motivación</label>
                    <textarea
                        id="carta"
                        rows={6}
                        value={carta}
                        onChange={(e) => setCarta(e.target.value)}
                        placeholder="Explica por qué te interesa este proyecto y qué aportarías..."
                        disabled={!!mensajeOk}
                    />
                    {mensajeOk && <p style={{ color: "green" }}>{mensajeOk}</p>}
                    {mensajeErr && (
                        <p role="alert" style={{ color: "red" }}>
                            {mensajeErr}
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={postularse}
                        disabled={enviando || !!mensajeOk}
                    >
                        {enviando ? "Enviando..." : "Enviar postulación"}
                    </button>
                </section>
            )}
        </main>
    );
}
