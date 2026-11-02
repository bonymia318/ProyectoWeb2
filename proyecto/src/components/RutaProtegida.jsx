import { Navigate } from "react-router-dom";

// Si no hay sesión, redirige al login; si hay, muestra la página
function RutaProtegida({ sesion, children }) {
    if (!sesion) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default RutaProtegida;