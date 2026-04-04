import axios from "axios";
import { mapsApiKey } from "./env.js";

interface Coordenadas {
    lat: number;
    lng: number;
}

/**
 * Geocodifica una dirección de texto a lat/lng usando la Google Geocoding API.
 * Se ejecuta server-side al registrar instituciones y proyectos.
 * Si no hay API key configurada, retorna null sin lanzar error.
 */
export const geocodificar = async (
    direccion: string,
): Promise<Coordenadas | null> => {
    if (!mapsApiKey) {
        console.warn(
            "[Maps] GOOGLE_MAPS_API_KEY no configurada — geocodificación omitida",
        );
        return null;
    }
    try {
        const { data } = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            {
                params: { address: direccion, key: mapsApiKey },
            },
        );
        if (data.status !== "OK") {
            console.warn("[Maps] Geocoding falló:", data.status);
            return null;
        }
        return data.results[0].geometry.location as Coordenadas;
    } catch (err) {
        console.error("[Maps] Error llamando a Geocoding API:", err);
        return null;
    }
};

/**
 * Fórmula de Haversine: distancia en km entre dos puntos geográficos.
 * Se ejecuta server-side en el endpoint GET /api/proyectos cuando se envían lat/lng.
 */
export const distanciaKm = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
): number => {
    const R = 6371;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
