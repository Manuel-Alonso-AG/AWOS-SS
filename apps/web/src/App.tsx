import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Páginas públicas
import { LoginPage } from "@/pages/LoginPage";
import { RegistroEstudiantePage } from "@/pages/RegistroEstudiantePage";
import { RegistroInstitucionPage } from "@/pages/RegistroInstitucionPage";
import { DashboardPage } from "@/pages/DashboardPage";

// Páginas del estudiante
import { ProyectosPage } from "@/pages/estudiante/ProyectosPage";
import { DetalleProyectoPage } from "@/pages/estudiante/DetalleProyectoPage";
import { MisPostulacionesPage } from "@/pages/estudiante/MisPostulacionesPage";
import { KardexPage } from "@/pages/estudiante/KardexPage";

// Páginas de la institución
import { MisProyectosPage } from "@/pages/institucion/MisProyectosPage";
import { PostulacionesProyectoPage } from "@/pages/institucion/PostulacionesProyectoPage";
import { ValidarHorasPage } from "@/pages/institucion/ValidarHorasPage";

// ── Nav mínima — el equipo la reemplazará con su diseño ──────────────────────
function Nav() {
    const { usuario, logout } = useAuth();
    if (!usuario) return null;

    const esEstudiante = usuario.rol === "estudiante";
    const esInstitucion = usuario.rol === "institucion";

    return (
        <nav>
            {esEstudiante && (
                <>
                    <Link to="/estudiante/proyectos">Proyectos</Link>
                    {" | "}
                    <Link to="/estudiante/postulaciones">
                        Mis postulaciones
                    </Link>
                    {" | "}
                    <Link to="/estudiante/kardex">Mi kardex</Link>
                </>
            )}
            {esInstitucion && (
                <>
                    <Link to="/institucion/proyectos">Mis proyectos</Link>
                    {" | "}
                    <Link to="/institucion/horas">Validar horas</Link>
                </>
            )}
            {" | "}
            <button type="button" onClick={logout}>
                Cerrar sesión ({usuario.matricula})
            </button>
        </nav>
    );
}

// ── Router ────────────────────────────────────────────────────────────────────
function AppRoutes() {
    return (
        <>
            <Nav />
            <Routes>
                {/* Públicas */}
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/registro/estudiante"
                    element={<RegistroEstudiantePage />}
                />
                <Route
                    path="/registro/institucion"
                    element={<RegistroInstitucionPage />}
                />

                {/* Redirección raíz */}
                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<ProtectedRoute />}>
                    <Route index element={<DashboardPage />} />
                </Route>

                {/* Rutas del estudiante */}
                <Route element={<ProtectedRoute roles={["estudiante"]} />}>
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
                    <Route path="/estudiante/kardex" element={<KardexPage />} />
                </Route>

                {/* Rutas de la institución */}
                <Route element={<ProtectedRoute roles={["institucion"]} />}>
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

                {/* 404 */}
                <Route path="*" element={<p>Página no encontrada.</p>} />
            </Routes>
        </>
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
