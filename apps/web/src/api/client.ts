// Cliente HTTP centralizado.
// Todas las llamadas a la API pasan por aquí — agrega el token JWT
// automáticamente si está en localStorage y normaliza los errores.

const BASE = "/api";

function getToken(): string | null {
    return localStorage.getItem("token");
}

interface RequestOptions {
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    body?: unknown;
    auth?: boolean; // true por defecto
}

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public errors: string[] = [],
    ) {
        super(message);
    }
}

async function request<T>(
    endpoint: string,
    opts: RequestOptions = {},
): Promise<T> {
    const { method = "GET", body, auth = true } = opts;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (auth) {
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE}${endpoint}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : null,
    });

    const json = await res.json();

    if (!res.ok) {
        throw new ApiError(
            res.status,
            json.message ?? "Error desconocido",
            json.errors ?? [],
        );
    }

    return json.data as T;
}

// ── Helpers por verbo ─────────────────────────────────────────────────────────
export const api = {
    get: <T>(url: string, auth = true) =>
        request<T>(url, { method: "GET", auth }),
    post: <T>(url: string, body: unknown, auth = true) =>
        request<T>(url, { method: "POST", body, auth }),
    patch: <T>(url: string, body: unknown) =>
        request<T>(url, { method: "PATCH", body }),
};
