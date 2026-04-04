// Vista principal del estudiante: lista proyectos publicados con filtros.
// El mapa es responsabilidad del equipo de diseño — este componente
// expone la maps_api_key y las coordenadas para integrarlo.

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, ApiError } from "@/api/client";
import type { VistaProyectoMapa } from "@awos-ss/types";

interface ProyectosResponse {
    proyectos: (VistaProyectoMapa & { distancia_km?: number })[];
    maps_api_key: string;
}

export function ProyectosPage() {
    const [data, setData] = useState<ProyectosResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filtros
    const [modalidad, setModalidad] = useState("");
    const [radio, setRadio] = useState("");
    const [usarUbicacion, setUsarUbicacion] = useState(false);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
        null,
    );

    const cargar = async (lat?: number, lng?: number) => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams();
            if (modalidad) params.set("modalidad", modalidad);
            if (lat !== undefined && lng !== undefined) {
                params.set("lat", String(lat));
                params.set("lng", String(lng));
                if (radio) params.set("radio", radio);
            }
            const result = await api.get<ProyectosResponse>(
                `/proyectos?${params}`,
            );
            setData(result);
        } catch (err) {
            setError(
                err instanceof ApiError
                    ? err.message
                    : "Error al cargar proyectos",
            );
        } finally {
            setLoading(false);
        }
    };

    // Carga inicial sin coordenadas
    useEffect(() => {
        cargar();
    }, []); // eslint-disable-line

    const handleFiltrar = () => {
        if (usarUbicacion && coords) cargar(coords.lat, coords.lng);
        else cargar();
    };

    const handleUbicacion = () => {
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const c = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };
                setCoords(c);
                setUsarUbicacion(true);
            },
            () => alert("No se pudo obtener tu ubicación"),
        );
    };

    return (
        <main>
            <h1>Proyectos de Servicio Social</h1>

            {/* ── Filtros ── */}
            <section aria-label="Filtros">
                <div>
                    <label htmlFor="modalidad">Modalidad</label>
                    <select
                        id="modalidad"
                        value={modalidad}
                        onChange={(e) => setModalidad(e.target.value)}
                    >
                        <option value="">Todas</option>
                        <option value="presencial">Presencial</option>
                        <option value="remoto">Remoto</option>
                        <option value="hibrido">Híbrido</option>
                    </select>
                </div>

                <div>
                    <button type="button" onClick={handleUbicacion}>
                        {usarUbicacion && coords
                            ? "📍 Ubicación obtenida"
                            : "Usar mi ubicación"}
                    </button>
                    {usarUbicacion && (
                        <>
                            <label htmlFor="radio">Radio (km)</label>
                            <input
                                id="radio"
                                type="number"
                                min={1}
                                max={200}
                                value={radio}
                                onChange={(e) => setRadio(e.target.value)}
                                placeholder="Ej. 10"
                            />
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleFiltrar}
                    disabled={loading}
                >
                    Buscar
                </button>
            </section>

            {/* El equipo de diseño puede conectar aquí el mapa de Google Maps
          usando data.maps_api_key y data.proyectos[n].latitud / .longitud */}
            {data?.maps_api_key && (
                <p style={{ fontSize: "0.8em", color: "#888" }}>
                    Maps API Key disponible en data.maps_api_key para el mapa
                    interactivo
                </p>
            )}

            {/* ── Lista ── */}
            {loading && <p>Cargando proyectos...</p>}
            {error && (
                <p role="alert" style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {data?.proyectos.map((p) => (
                <article key={p.id_proyecto}>
                    <h2>{p.titulo}</h2>
                    <p>
                        {p.institucion} · {p.area}
                    </p>
                    <p>
                        Modalidad: {p.modalidad} | Horas: {p.horas_requeridas} |
                        Plazas: {p.plazas_disponibles}
                    </p>
                    {p.distancia_km !== undefined && (
                        <p>Distancia: {p.distancia_km} km</p>
                    )}
                    <Link to={`/estudiante/proyectos/${p.id_proyecto}`}>
                        Ver detalle
                    </Link>
                </article>
            ))}

            {data?.proyectos.length === 0 && !loading && (
                <p>
                    No hay proyectos disponibles con los filtros seleccionados.
                </p>
            )}
        </main>
    );
}
