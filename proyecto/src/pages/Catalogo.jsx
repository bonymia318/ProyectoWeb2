import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { obtenerProductos } from "../services/apiServices";

function Catalogo({ onAgregar }) {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(function () {
        async function cargar() {
            try {
                const lista = await obtenerProductos(12, 0);
                setProductos(lista);
            } catch (e) {
                setError(e.message);
            }
            setCargando(false);
        }
        cargar();
    }, []);

    return (
        <section className="seccion-productos">
            <div className="titulo-seccion">
                <p>Catálogo</p>
                <h2>Todos los productos</h2>
            </div>
            {cargando && <p>Cargando productos...</p>}
            {error && <p role="alert">{error}</p>}
            {!cargando && !error && (
                <ProductCard productos={productos} onAgregar={onAgregar} />
            )}
        </section>
    );
}

export default Catalogo;