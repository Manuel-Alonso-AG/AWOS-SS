process.loadEnvFile();

const {
    PORT = 3000,
    DB_HOST = "localhost",
    DB_USER = "root",
    DB_PASSWORD = "",
    DB_NAME = "awoss_ss",
    JWT_SECRET = "secret",
    JWT_EXPIRES_IN = "24h",
    GEOCODING_API = "https://maps.googleapis.com/maps/api/geocode/json",
} = process.env;

export const port: number = Number(PORT);
export const dbHost: string = DB_HOST;
export const dbUser: string = DB_USER;
export const dbPassword: string = DB_PASSWORD;
export const dbName: string = DB_NAME;
export const jwtSecret: string = JWT_SECRET;
export const jwtExpiresIn: string = JWT_EXPIRES_IN;
export const geocodingAPI: string = GEOCODING_API;
