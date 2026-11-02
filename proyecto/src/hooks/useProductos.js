import { useEffect, useState } from "react";
import { obtenerProductos } from "../services/apiServices";

// Hook propio: carga productos según búsqueda, categoría, orden y página.
// Regresa los datos junto con los estados de carga y error.
function useProductos(busqueda, categoria, orden, pagina, limite) {
    const [productos, setProductos] = useState([]);
    const [total, setTotal] = useState(0);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [intento, setIntento] = useState(0);

    useEffect(function () {
        // "vigente" evita guardar datos de una petición vieja
        let vigente = true;

        async function cargar() {
            setCargando(true);
            setError("");

            // orden viene como "price-asc": lo separamos en dos partes
            const partes = orden.split("-");

            try {
                const resultado = await obtenerProductos({
                    busqueda: busqueda,
                    categoria: categoria,
                    limite: limite,
                    saltar: pagina * limite,
                    ordenarPor: partes[0],
                    orden: partes[1]
                });

                if (vigente) {
                    setProductos(resultado.productos);
                    setTotal(resultado.total);
                }
            } catch (e) {
                if (vigente) {
                    setError(e.message);
                }
            } finally {
                if (vigente) {
                    setCargando(false);
                }
            }
        }

        cargar();

        return function () {
            vigente = false;
        };
    }, [busqueda, categoria, orden, pagina, limite, intento]);

    // Al subir "intento" el efecto se ejecuta otra vez
    function reintentar() {
        setIntento(intento + 1);
    }

    return { productos, total, cargando, error, reintentar };
}

export default useProductos;