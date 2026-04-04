import { useParams } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { api, ApiError } from "@/api/client";
import { useState } from "react";

interface Postulante {
    id_postulacion: number;
    matricula: string;
    email: string;
    carta_motivacion: string;
    estatus: string;
}

export function PostulacionesProyectoPage() {
    const { id } = useParams<{ id: string }>();
    const {
        data: postulantes,
        loading,
        error,
        refetch,
    } = useFetch<Postulante[]>(id ? `/postulaciones/proyecto/${id}` : null);

    const [procesando, setProcesando] = useState<number | null>(null);
    const [mensajes, setMensajes] = useState<Record<number, string>>({});

    const responder = async (
        id_postulacion: number,
        estatus: "aceptada" | "rechazada",
    ) => {
        setProcesando(id_postulacion);
        try {
            await api.patch(`/postulaciones/${id_postulacion}/responder`, {
                estatus,
            });
            setMensajes((m) => ({
                ...m,
                [id_postulacion]: `Postulación ${estatus}`,
            }));
            refetch();
        } catch (err) {
            setMensajes((m) => ({
                ...m,
                [id_postulacion]:
                    err instanceof ApiError ? err.message : "Error",
            }));
        } finally {
            setProcesando(null);
        }
    };

    if (loading) return <p>Cargando postulantes...</p>;
    if (error)
        return (
            <p role="alert" style={{ color: "red" }}>
                {error}
            </p>
        );

    return (
        <main>
            <h1>Postulantes — Proyecto #{id}</h1>

            {postulantes?.length === 0 && <p>Sin postulantes aún.</p>}

            {postulantes?.map((p) => (
                <article key={p.id_postulacion}>
                    <h2>{p.matricula}</h2>
                    <p>{p.email}</p>
                    <details>
                        <summary>Ver carta de motivación</summary>
                        <p>{p.carta_motivacion}</p>
                    </details>
                    <p>
                        Estatus: <strong>{p.estatus}</strong>
                    </p>

                    {mensajes[p.id_postulacion] && (
                        <p
                            style={{
                                color: mensajes[p.id_postulacion]!.includes(
                                    "Error",
                                )
                                    ? "red"
                                    : "green",
                            }}
                        >
                            {mensajes[p.id_postulacion]}
                        </p>
                    )}

                    {p.estatus === "pendiente" && (
                        <div>
                            <button
                                type="button"
                                disabled={procesando === p.id_postulacion}
                                onClick={() =>
                                    responder(p.id_postulacion, "aceptada")
                                }
                            >
                                Aceptar
                            </button>
                            <button
                                type="button"
                                disabled={procesando === p.id_postulacion}
                                onClick={() =>
                                    responder(p.id_postulacion, "rechazada")
                                }
                            >
                                Rechazar
                            </button>
                        </div>
                    )}
                </article>
            ))}
        </main>
    );
}
