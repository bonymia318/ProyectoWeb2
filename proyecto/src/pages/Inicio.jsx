import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { obtenerProductos } from "../services/apiServices";

function Inicio({ onAgregar }) {
    const [destacados, setDestacados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(function () {
        async function cargar() {
            try {
                const lista = await obtenerProductos(4, 0);
                setDestacados(lista);
            } catch (e) {
                setError(e.message);
            }
            setCargando(false);
        }
        cargar();
    }, []);

    return (
        <div>
            <Hero />
            <section className="seccion-productos">
                <div className="titulo-seccion">
                    <p>Catálogo</p>
                    <h2>Productos destacados</h2>
                </div>
                {cargando && <p>Cargando productos...</p>}
                {error && <p role="alert">{error}</p>}
                {!cargando && !error && (
                    <ProductCard productos={destacados} onAgregar={onAgregar} />
                )}
            </section>
        </div>
    );
}

export default Inicio;