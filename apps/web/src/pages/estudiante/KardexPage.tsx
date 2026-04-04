import { useAuth } from "@/hooks/useAuth.ts";
import { useFetch } from "@/hooks/useFetch";
import type { VistaKardexSS } from "@awos-ss/types";

export function KardexPage() {
    const { usuario } = useAuth();

    const {
        data: kardex,
        loading,
        error,
    } = useFetch<VistaKardexSS[]>(
        usuario ? `/horas/kardex/${usuario.matricula}` : null,
    );

    const totalValidadas =
        kardex?.reduce((acc, k) => acc + k.horas_validadas, 0) ?? 0;
    const totalRequeridas =
        kardex?.reduce((acc, k) => acc + k.horas_requeridas, 0) ?? 0;
    const porcentajeGlobal =
        totalRequeridas > 0
            ? Math.round((totalValidadas / totalRequeridas) * 100)
            : 0;

    if (loading) return <p>Cargando kardex...</p>;
    if (error)
        return (
            <p role="alert" style={{ color: "red" }}>
                {error}
            </p>
        );

    return (
        <main>
            <h1>Mi Kardex de Servicio Social</h1>
            <p>Matrícula: {usuario?.matricula}</p>

            {/* Resumen global */}
            <section aria-label="Resumen global">
                <p>
                    Horas validadas totales: {totalValidadas} /{" "}
                    {totalRequeridas}
                </p>
                {/* Barra de progreso nativa — el equipo puede estilizarla */}
                <progress
                    value={porcentajeGlobal}
                    max={100}
                    aria-label={`${porcentajeGlobal}%`}
                />
                <span>{porcentajeGlobal}%</span>
            </section>

            {kardex?.length === 0 && <p>Sin registros aún.</p>}

            {kardex?.map((k) => (
                <article key={k.id_proyecto}>
                    <h2>{k.titulo}</h2>
                    <p>
                        {k.institucion} · {k.area}
                    </p>
                    <p>
                        Horas: {k.horas_validadas} validadas /{" "}
                        {k.horas_pendientes} pendientes / {k.horas_requeridas}{" "}
                        requeridas
                    </p>
                    <progress value={k.porcentaje_avance} max={100} />
                    <span>{k.porcentaje_avance}%</span>
                </article>
            ))}
        </main>
    );
}
