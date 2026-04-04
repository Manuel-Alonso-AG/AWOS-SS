process.loadEnvFile?.();

const {
    PORT = "3001",
    DB_HOST = "localhost",
    DB_USER = "root",
    DB_PASSWORD = "",
    DB_NAME = "awos",
    JWT_SECRET = "cambia_este_secreto_en_produccion",
    JWT_EXPIRES_IN = "24h",
    GOOGLE_MAPS_API_KEY = "",
    FRONTEND_URL = "http://localhost:5173",
} = process.env;

export const port = Number(PORT);
export const dbHost = DB_HOST;
export const dbUser = DB_USER;
export const dbPassword = DB_PASSWORD;
export const dbName = DB_NAME;
export const jwtSecret = JWT_SECRET;
export const jwtExpiresIn = JWT_EXPIRES_IN;
export const mapsApiKey = GOOGLE_MAPS_API_KEY;
export const frontendUrl = FRONTEND_URL;
