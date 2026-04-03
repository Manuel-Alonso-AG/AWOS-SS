import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import path from "path";

export default ({ mode }: ConfigEnv) => {
    const env = loadEnv(mode, process.cwd(), "");

    return defineConfig({
        plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
        resolve: {
            alias: { "@": path.resolve(__dirname, "./src") },
        },
        server: {
            port: Number(env.VITE_PORT || 5173),
            proxy: {
                "/api": {
                    target: env.VITE_API_URL || "http://localhost:3000",
                    changeOrigin: true,
                },
            },
        },
    });
};
