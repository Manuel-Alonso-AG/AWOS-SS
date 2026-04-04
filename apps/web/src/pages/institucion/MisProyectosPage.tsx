import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { api, ApiError } from "@/api/client";
import type { Area } from "@awos-ss/types";

interface ProyectoConPostulaciones {
    id_proyecto: number;
    titulo: string;
    modalidad: string;
    horas_requeridas: number;
    plazas_total: number;
    plazas_ocupadas: number;
    estatus: string;
    total_postulaciones: number;
}

export function MisProyectosPage() {
    const {
        data: proyectos,
        loading,
        error,
        refetch,
    } = useFetch<ProyectoConPostulaciones[]>("/proyectos/mis-proyectos");
    const { data: areas } = useFetch<Area[]>("/proyectos/areas");

    const [mostrarForm, setMostrarForm] = useState(false);
    const [form, setForm] = useState({
        id_area: "",
        titulo: "",
        modalidad: "",
        horas_requeridas: "",
        plazas_total: "",
        direccion_proyecto: "",
        estatus: "borrador",
    });
    const [creando, setCreando] = useState(false);
    const [mensajeOk, setMensajeOk] = useState("");
    const [mensajeErr, setMensajeErr] = useState("");

    const set =
        (f: string) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setForm((prev) => ({ ...prev, [f]: e.target.value }));

    const crearProyecto = async () => {
        const {
            id_area,
            titulo,
            modalidad,
            horas_requeridas,
            plazas_total,
            direccion_proyecto,
            estatus,
        } = form;
        if (
            !id_area ||
            !titulo ||
            !modalidad ||
            !horas_requeridas ||
            !plazas_total ||
            !direccion_proyecto
        ) {
            setMensajeErr("Todos los campos son obligatorios");
            return;
        }
        setCreando(true);
        setMensajeErr("");
        try {
            await api.post("/proyectos", {
                id_area: Number(id_area),
                titulo,
                modalidad,
                horas_requeridas: Number(horas_requeridas),
                plazas_total: Number(plazas_total),
                direccion_proyecto,
                estatus,
            });
            setMensajeOk("Proyecto creado exitosamente");
            setForm({
                id_area: "",
                titulo: "",
                modalidad: "",
                horas_requeridas: "",
                plazas_total: "",
                direccion_proyecto: "",
                estatus: "borrador",
            });
            setMostrarForm(false);
            refetch();
        } catch (err) {
            setMensajeErr(
                err instanceof ApiError
                    ? err.message
                    : "Error al crear proyecto",
            );
        } finally {
            setCreando(false);
        }
    };

    if (loading) return <p>Cargando proyectos...</p>;
    if (error)
        return (
            <p role="alert" style={{ color: "red" }}>
                {error}
            </p>
        );

    return (
        <main>
            <h1>Mis proyectos</h1>

            <button
                type="button"
                onClick={() => {
                    setMostrarForm(!mostrarForm);
                    setMensajeOk("");
                    setMensajeErr("");
                }}
            >
                {mostrarForm ? "Cancelar" : "+ Publicar nuevo proyecto"}
            </button>

            {mensajeOk && <p style={{ color: "green" }}>{mensajeOk}</p>}

            {/* ── Formulario de creación ── */}
            {mostrarForm && (
                <section aria-label="Nuevo proyecto">
                    <h2>Nuevo proyecto</h2>

                    <div>
                        <label htmlFor="titulo">Título</label>
                        <input
                            id="titulo"
                            type="text"
                            value={form.titulo}
                            onChange={set("titulo")}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="id_area">Área</label>
                        <select
                            id="id_area"
                            value={form.id_area}
                            onChange={set("id_area")}
                            required
                        >
                            <option value="">Selecciona...</option>
                            {areas?.map((a) => (
                                <option key={a.id_area} value={a.id_area}>
                                    {a.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="modalidad">Modalidad</label>
                        <select
                            id="modalidad"
                            value={form.modalidad}
                            onChange={set("modalidad")}
                            required
                        >
                            <option value="">Selecciona...</option>
                            <option value="presencial">Presencial</option>
                            <option value="remoto">Remoto</option>
                            <option value="hibrido">Híbrido</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="horas">Horas requeridas</label>
                        <input
                            id="horas"
                            type="number"
                            min={1}
                            value={form.horas_requeridas}
                            onChange={set("horas_requeridas")}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="plazas">Plazas disponibles</label>
                        <input
                            id="plazas"
                            type="number"
                            min={1}
                            value={form.plazas_total}
                            onChange={set("plazas_total")}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="direccion">
                            Dirección del proyecto
                        </label>
                        <input
                            id="direccion"
                            type="text"
                            value={form.direccion_proyecto}
                            onChange={set("direccion_proyecto")}
                            placeholder="Calle, número, colonia, ciudad"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="estatus">Estatus inicial</label>
                        <select
                            id="estatus"
                            value={form.estatus}
                            onChange={set("estatus")}
                        >
                            <option value="borrador">Borrador</option>
                            <option value="publicado">Publicado</option>
                        </select>
                    </div>

                    {mensajeErr && (
                        <p role="alert" style={{ color: "red" }}>
                            {mensajeErr}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={crearProyecto}
                        disabled={creando}
                    >
                        {creando
                            ? "Creando... (geocodificando dirección)"
                            : "Crear proyecto"}
                    </button>
                </section>
            )}

            {/* ── Lista de proyectos ── */}
            {proyectos?.length === 0 && <p>Aún no has publicado proyectos.</p>}

            {proyectos?.map((p) => (
                <article key={p.id_proyecto}>
                    <h2>{p.titulo}</h2>
                    <p>
                        Modalidad: {p.modalidad} | Horas: {p.horas_requeridas}
                    </p>
                    <p>
                        Plazas: {p.plazas_ocupadas}/{p.plazas_total} | Estatus:{" "}
                        {p.estatus}
                    </p>
                    <p>Postulaciones recibidas: {p.total_postulaciones}</p>
                    <Link
                        to={`/institucion/proyectos/${p.id_proyecto}/postulaciones`}
                    >
                        Ver postulaciones
                    </Link>
                </article>
            ))}
        </main>
    );
}
