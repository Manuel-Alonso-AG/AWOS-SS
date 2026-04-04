import { useFetch } from "@/hooks/useFetch";
import { api, ApiError } from "@/api/client";
import { useState } from "react";

interface RegistroPendiente {
    id_registro: number;
    matricula: string;
    proyecto: string;
    fecha_actividad: string;
    horas: number;
    descripcion: string;
    evidencia_url: string;
}

export function ValidarHorasPage() {
    const {
        data: pendientes,
        loading,
        error,
        refetch,
    } = useFetch<RegistroPendiente[]>("/horas/pendientes");

    const [procesando, setProcesando] = useState<number | null>(null);
    const [mensajes, setMensajes] = useState<Record<number, string>>({});

    const validar = async (id_registro: number, validado: boolean) => {
        setProcesando(id_registro);
        try {
            await api.patch(`/horas/${id_registro}/validar`, { validado });
            setMensajes((m) => ({
                ...m,
                [id_registro]: validado
                    ? "Horas validadas"
                    : "Horas rechazadas",
            }));
            refetch();
        } catch (err) {
            setMensajes((m) => ({
                ...m,
                [id_registro]: err instanceof ApiError ? err.message : "Error",
            }));
        } finally {
            setProcesando(null);
        }
    };

    if (loading) return <p>Cargando registros pendientes...</p>;
    if (error)
        return (
            <p role="alert" style={{ color: "red" }}>
                {error}
            </p>
        );

    return (
        <main>
            <h1>Validar horas pendientes</h1>

            {pendientes?.length === 0 && (
                <p>No hay horas pendientes de validación.</p>
            )}

            {pendientes?.map((r) => (
                <article key={r.id_registro}>
                    <h2>
                        {r.matricula} — {r.proyecto}
                    </h2>
                    <p>
                        Fecha: {r.fecha_actividad} | Horas: {r.horas}
                    </p>
                    <p>{r.descripcion}</p>
                    <p>
                        Evidencia:{" "}
                        <a
                            href={r.evidencia_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {r.evidencia_url}
                        </a>
                    </p>

                    {mensajes[r.id_registro] ? (
                        <p
                            style={{
                                color: mensajes[r.id_registro]!.includes(
                                    "Error",
                                )
                                    ? "red"
                                    : "green",
                            }}
                        >
                            {mensajes[r.id_registro]}
                        </p>
                    ) : (
                        <div>
                            <button
                                type="button"
                                disabled={procesando === r.id_registro}
                                onClick={() => validar(r.id_registro, true)}
                            >
                                ✓ Validar
                            </button>
                            <button
                                type="button"
                                disabled={procesando === r.id_registro}
                                onClick={() => validar(r.id_registro, false)}
                            >
                                ✗ Rechazar
                            </button>
                        </div>
                    )}
                </article>
            ))}
        </main>
    );
}
