import { useContext } from "react";
import { SesionContext } from "../context/SesionContext";

// Hook propio: da acceso a la sesión desde cualquier componente
function useSesion() {
    const contexto = useContext(SesionContext);

    // Si se usa fuera del proveedor, avisamos con un error claro
    if (!contexto) {
        throw new Error("useSesion debe usarse dentro de SesionProvider");
    }

    return contexto;
}

export default useSesion;