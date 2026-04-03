import axios from "axios";
import { geocodingAPI } from "./env";

interface Coordenadas {
    lat: number;
    lng: number;
}

/**
 * Convierte una dirección de texto en coordenadas lat/lng
 * usando la Google Geocoding API (server-side).
 */
export const geocodificar = async (
    direccion: string,
): Promise<Coordenadas | null> => {
    try {
        const url = "https://maps.googleapis.com/maps/api/geocode/json";
        const { data } = await axios.get(url, {
            params: { address: direccion, key: geocodingAPI },
        });
        if (data.status !== "OK") return null;
        return data.results[0].geometry.location as Coordenadas;
    } catch {
        console.error("[Maps] Error en Geocoding API");
        return null;
    }
};

/**
 * Fórmula de Haversine: calcula la distancia en km entre
 * dos puntos geográficos dados sus coordenadas lat/lng.
 */
export const distanciaKm = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
): number => {
    const R = 6371; // Radio de la Tierra en km
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
