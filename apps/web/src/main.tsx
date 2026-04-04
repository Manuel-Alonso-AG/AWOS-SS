import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// El equipo agrega sus estilos aquí:
// import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
