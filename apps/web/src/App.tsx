import "./index.css";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    NavLink,
} from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import { LoginPage } from "@/pages/LoginPage";
import { RegistroEstudiantePage } from "@/pages/RegistroEstudiantePage";
import { RegistroInstitucionPage } from "@/pages/RegistroInstitucionPage";
import { DashboardPage } from "@/pages/DashboardPage";

import { ProyectosPage } from "@/pages/estudiante/ProyectosPage";
import { DetalleProyectoPage } from "@/pages/estudiante/DetalleProyectoPage";
import { MisPostulacionesPage } from "@/pages/estudiante/MisPostulacionesPage";
import { KardexPage } from "@/pages/estudiante/KardexPage";

import { MisProyectosPage } from "@/pages/institucion/MisProyectosPage";
import { PostulacionesProyectoPage } from "@/pages/institucion/PostulacionesProyectoPage";
import { ValidarHorasPage } from "@/pages/institucion/ValidarHorasPage";

// ── Icons (inline SVG) ───────────────────────────────────────────────────────
const IconMap = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
    >
        <path d="M9 11a3 3 0 1 0 6 0 3 3 0 0 0-6 0z" />
        <path d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
    </svg>
);
const IconList = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
    >
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
);
const IconClipboard = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
    >
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
    </svg>
);
const IconAward = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
    >
        <circle cx="12" cy="8" r="6" />
        <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
    </svg>
);
const IconPlus = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
    >
        <path d="M12 5v14m-7-7h14" />
    </svg>
);
const IconCheck = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
    >
        <path d="m20 6-11 11-5-5" />
    </svg>
);

function Nav() {
    const { usuario, logout } = useAuth();
    if (!usuario) return null;

    const esEstudiante = usuario.rol === "estudiante";
    const esInstitucion = usuario.rol === "institucion";
    const initials = usuario.matricula.substring(0, 2).toUpperCase();

    return (
        <>
            <header className="topbar">
                <a href="/" className="topbar-brand">
                    <div className="topbar-brand-logo">SS</div>
                    <span className="topbar-brand-name">
                        AWOS<span>·SS</span>
                    </span>
                </a>
                <div className="topbar-spacer" />
                <div className="topbar-user">
                    <div className="topbar-user-info">
                        <div className="topbar-user-name">
                            {usuario.matricula}
                        </div>
                        <div className="topbar-user-role">{usuario.rol}</div>
                    </div>
                    <div className="topbar-avatar">{initials}</div>
                    <button className="topbar-logout" onClick={logout}>
                        Salir
                    </button>
                </div>
            </header>

            <nav className="sidebar">
                {esEstudiante && (
                    <>
                        <div className="sidebar-section">Explorar</div>
                        <NavLink
                            to="/estudiante/proyectos"
                            className={({ isActive }) =>
                                "sidebar-link" + (isActive ? " active" : "")
                            }
                        >
                            <span className="sidebar-icon">
                                <IconMap />
                            </span>
                            Proyectos
                        </NavLink>
                        <div className="sidebar-section">Mi Actividad</div>
                        <NavLink
                            to="/estudiante/postulaciones"
                            className={({ isActive }) =>
                                "sidebar-link" + (isActive ? " active" : "")
                            }
                        >
                            <span className="sidebar-icon">
                                <IconList />
                            </span>
                            Mis postulaciones
                        </NavLink>
                        <NavLink
                            to="/estudiante/kardex"
                            className={({ isActive }) =>
                                "sidebar-link" + (isActive ? " active" : "")
                            }
                        >
                            <span className="sidebar-icon">
                                <IconAward />
                            </span>
                            Mi Kardex
                        </NavLink>
                    </>
                )}
                {esInstitucion && (
                    <>
                        <div className="sidebar-section">Gestión</div>
                        <NavLink
                            to="/institucion/proyectos"
                            className={({ isActive }) =>
                                "sidebar-link" + (isActive ? " active" : "")
                            }
                        >
                            <span className="sidebar-icon">
                                <IconPlus />
                            </span>
                            Mis proyectos
                        </NavLink>
                        <NavLink
                            to="/institucion/horas"
                            className={({ isActive }) =>
                                "sidebar-link" + (isActive ? " active" : "")
                            }
                        >
                            <span className="sidebar-icon">
                                <IconCheck />
                            </span>
                            Validar horas
                        </NavLink>
                        <NavLink
                            to="/institucion/postulaciones-overview"
                            className={({ isActive }) =>
                                "sidebar-link" + (isActive ? " active" : "")
                            }
                        >
                            <span className="sidebar-icon">
                                <IconClipboard />
                            </span>
                            Postulaciones
                        </NavLink>
                    </>
                )}
            </nav>
        </>
    );
}

function AppRoutes() {
    const { usuario } = useAuth();
    const hasNav = !!usuario;

    return (
        <div className={hasNav ? "app-layout" : ""}>
            {hasNav && <Nav />}
            <div className={hasNav ? "app-body" : ""}>
                <main className={hasNav ? "main-content" : ""}>
                    <div className={hasNav ? "page-content" : ""}>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/registro/estudiante"
                                element={<RegistroEstudiantePage />}
                            />
                            <Route
                                path="/registro/institucion"
                                element={<RegistroInstitucionPage />}
                            />
                            <Route
                                path="/"
                                element={<Navigate to="/dashboard" replace />}
                            />
                            <Route
                                path="/dashboard"
                                element={<ProtectedRoute />}
                            >
                                <Route index element={<DashboardPage />} />
                            </Route>
                            <Route
                                element={
                                    <ProtectedRoute roles={["estudiante"]} />
                                }
                            >
                                <Route
                                    path="/estudiante/proyectos"
                                    element={<ProyectosPage />}
                                />
                                <Route
                                    path="/estudiante/proyectos/:id"
                                    element={<DetalleProyectoPage />}
                                />
                                <Route
                                    path="/estudiante/postulaciones"
                                    element={<MisPostulacionesPage />}
                                />
                                <Route
                                    path="/estudiante/kardex"
                                    element={<KardexPage />}
                                />
                            </Route>
                            <Route
                                element={
                                    <ProtectedRoute roles={["institucion"]} />
                                }
                            >
                                <Route
                                    path="/institucion/proyectos"
                                    element={<MisProyectosPage />}
                                />
                                <Route
                                    path="/institucion/proyectos/:id/postulaciones"
                                    element={<PostulacionesProyectoPage />}
                                />
                                <Route
                                    path="/institucion/horas"
                                    element={<ValidarHorasPage />}
                                />
                            </Route>
                            <Route
                                path="*"
                                element={
                                    <div
                                        className="empty-state"
                                        style={{ marginTop: "4rem" }}
                                    >
                                        <div className="empty-icon">🔍</div>
                                        <div className="empty-title">
                                            Página no encontrada
                                        </div>
                                        <p className="empty-sub">
                                            La ruta que buscas no existe.
                                        </p>
                                    </div>
                                }
                            />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
