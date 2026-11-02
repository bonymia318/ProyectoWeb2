import { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";

// Hook propio: da acceso al carrito desde cualquier componente
function useCarrito() {
    const contexto = useContext(CarritoContext);

    // Si se usa fuera del proveedor, avisamos con un error claro
    if (!contexto) {
        throw new Error("useCarrito debe usarse dentro de CarritoProvider");
    }

    return contexto;
}

export default useCarrito;