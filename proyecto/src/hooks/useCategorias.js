import { useEffect, useState } from "react";
import { obtenerCategorias } from "../services/apiServices";

// Hook propio: carga la lista de categorías una sola vez
function useCategorias() {
    const [categorias, setCategorias] = useState([]);

    useEffect(function () {
        let vigente = true;

        async function cargar() {
            try {
                const lista = await obtenerCategorias();

                if (vigente) {
                    setCategorias(lista);
                }
            } catch {
                // Si falla, el filtro solo muestra "Todas las categorías"
            }
        }

        cargar();

        return function () {
            vigente = false;
        };
    }, []);

    return categorias;
}

export default useCategorias;