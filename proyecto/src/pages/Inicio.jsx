import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import Cargando from "../components/Cargando";
import MensajeError from "../components/MensajeError";
import useProductos from "../hooks/useProductos";

function Inicio({ onAgregar, carrito }) {
    // Los 4 primeros productos como destacados
    const { productos, cargando, error, reintentar } = useProductos(
        "",
        "",
        "title-asc",
        0,
        4
    );

    let contenido = null;

    if (cargando) {
        contenido = <Cargando mensaje="Cargando productos..." />;
    } else if (error) {
        contenido = <MensajeError mensaje={error} onReintentar={reintentar} />;
    } else {
        contenido = (
            <ProductCard
                productos={productos}
                onAgregar={onAgregar}
                carrito={carrito}
            />
        );
    }

    return (
        <div>
            <Hero />
            <section className="seccion-productos">
                <div className="titulo-seccion">
                    <p>Catálogo</p>
                    <h2>Productos destacados</h2>
                </div>
                {contenido}
            </section>
        </div>
    );
}

export default Inicio;