import { Navigate } from "react-router-dom";
import useSesion from "../hooks/useSesion";

// Si no hay sesión, redirige al login; si hay, muestra la página
function RutaProtegida({ children }) {
    const { sesion } = useSesion();

    if (!sesion) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default RutaProtegida;