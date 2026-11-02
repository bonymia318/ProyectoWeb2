import { useState } from "react";
import ProductCard from "../components/ProductCard";
import Buscador from "../components/Buscador";
import FiltroCategoria from "../components/FiltroCategoria";
import SelectorOrden from "../components/SelectorOrden";
import Paginacion from "../components/Paginacion";
import Cargando from "../components/Cargando";
import MensajeError from "../components/MensajeError";
import useProductos from "../hooks/useProductos";
import useCategorias from "../hooks/useCategorias";

const PRODUCTOS_POR_PAGINA = 12;

function Catalogo({ onAgregar, carrito }) {
    // Lo que se escribe en el buscador y lo que ya se buscó
    const [terminoBusqueda, setTerminoBusqueda] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [categoria, setCategoria] = useState("");
    const [orden, setOrden] = useState("title-asc");
    const [pagina, setPagina] = useState(0);

    const categorias = useCategorias();
    const { productos, total, cargando, error, reintentar } = useProductos(
        busqueda,
        categoria,
        orden,
        pagina,
        PRODUCTOS_POR_PAGINA
    );

    const totalPaginas = Math.ceil(total / PRODUCTOS_POR_PAGINA);

    // Cada cambio de filtro regresa a la primera página
    function buscar() {
        setBusqueda(terminoBusqueda.trim());
        setPagina(0);
    }

    function limpiarBusqueda() {
        setTerminoBusqueda("");
        setBusqueda("");
        setPagina(0);
    }

    function cambiarCategoria(valor) {
        setCategoria(valor);
        setPagina(0);
    }

    function cambiarOrden(valor) {
        setOrden(valor);
        setPagina(0);
    }

    function paginaAnterior() {
        setPagina(pagina - 1);
    }

    function paginaSiguiente() {
        setPagina(pagina + 1);
    }

    // Qué mostrar según el estado de la petición
    let contenido = null;

    if (cargando) {
        contenido = <Cargando mensaje="Cargando productos..." />;
    } else if (error) {
        contenido = <MensajeError mensaje={error} onReintentar={reintentar} />;
    } else if (productos.length === 0) {
        contenido = <p>No se encontraron productos.</p>;
    } else {
        contenido = (
            <>
                <ProductCard
                    productos={productos}
                    onAgregar={onAgregar}
                    carrito={carrito}
                />
                <Paginacion
                    pagina={pagina}
                    totalPaginas={totalPaginas}
                    onAnterior={paginaAnterior}
                    onSiguiente={paginaSiguiente}
                />
            </>
        );
    }

    return (
        <section className="seccion-productos">
            <div className="titulo-seccion">
                <p>Catálogo</p>
                <h2>Todos los productos</h2>
            </div>

            <Buscador
                valor={terminoBusqueda}
                hayBusqueda={busqueda !== ""}
                onCambiar={setTerminoBusqueda}
                onBuscar={buscar}
                onLimpiar={limpiarBusqueda}
            />

            <div className="catalogo-controles">
                <FiltroCategoria
                    categorias={categorias}
                    valor={categoria}
                    onCambiar={cambiarCategoria}
                />
                <SelectorOrden valor={orden} onCambiar={cambiarOrden} />
            </div>

            {contenido}
        </section>
    );
}

export default Catalogo;