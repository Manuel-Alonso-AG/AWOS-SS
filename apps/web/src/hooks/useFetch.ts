// Hook genérico para llamadas GET — maneja loading, data y error.
import { useState, useEffect } from "react";
import { api, ApiError } from "@/api/client";

export function useFetch<T>(url: string | null) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const refetch = (overrideUrl?: string) => {
        const target = overrideUrl ?? url;
        if (!target) return;
        setLoading(true);
        setError("");
        api.get<T>(target)
            .then(setData)
            .catch((err) =>
                setError(
                    err instanceof ApiError ? err.message : "Error de red",
                ),
            )
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        refetch(); // eslint-disable-line
    }, [url]); // eslint-disable-line

    return { data, loading, error, refetch };
}
