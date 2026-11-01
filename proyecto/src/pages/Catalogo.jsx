import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import {
    obtenerCategorias,
    obtenerProductos
} from "../services/apiServices";

const PRODUCTOS_POR_PAGINA = 12;

function Catalogo({ onAgregar, carrito }) {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState("");
    const [orden, setOrden] = useState("title-asc");
    const [pagina, setPagina] = useState(0);
    const [total, setTotal] = useState(0);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [intento, setIntento] = useState(0);

    useEffect(function () {
        let vigente = true;

        async function cargarCategorias() {
            try {
                const lista = await obtenerCategorias();

                if (vigente) {
                    setCategorias(lista);
                }
            } catch (e) {
                if (vigente) {
                    setError(e.message);
                    setCargando(false);
                }
            }
        }

        cargarCategorias();

        return function () {
            vigente = false;
        };
    }, []);

    useEffect(function () {
        let vigente = true;

        async function cargarProductos() {
            setCargando(true);
            setError("");

            const [ordenarPor, direccion] = orden.split("-");

            try {
                const resultado = await obtenerProductos({
                    categoria,
                    limite: PRODUCTOS_POR_PAGINA,
                    saltar: pagina * PRODUCTOS_POR_PAGINA,
                    ordenarPor,
                    orden: direccion
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

        cargarProductos();

        return function () {
            vigente = false;
        };
    }, [categoria, orden, pagina, intento]);

    const totalPaginas = Math.ceil(total / PRODUCTOS_POR_PAGINA);

    function cambiarCategoria(evento) {
        setCategoria(evento.target.value);
        setPagina(0);
    }

    function cambiarOrden(evento) {
        setOrden(evento.target.value);
        setPagina(0);
    }

    return (
        <section className="seccion-productos">
            <div className="titulo-seccion">
                <p>Catálogo</p>
                <h2>Todos los productos</h2>
            </div>

            <div className="catalogo-controles">
                <label>
                    Categoría
                    <select value={categoria} onChange={cambiarCategoria}>
                        <option value="">Todas las categorías</option>
                        {categorias.map(function (item) {
                            return (
                                <option key={item.slug} value={item.slug}>
                                    {item.nombre}
                                </option>
                            );
                        })}
                    </select>
                </label>

                <label>
                    Ordenar por
                    <select value={orden} onChange={cambiarOrden}>
                        <option value="title-asc">Nombre: A-Z</option>
                        <option value="title-desc">Nombre: Z-A</option>
                        <option value="price-asc">Precio: menor a mayor</option>
                        <option value="price-desc">Precio: mayor a menor</option>
                    </select>
                </label>
            </div>

            {cargando && <p>Cargando productos...</p>}

            {error && (
                <div role="alert">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={function () {
                            setIntento(function (actual) {
                                return actual + 1;
                            });
                        }}
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {!cargando && !error && productos.length === 0 && (
                <p>No se encontraron productos.</p>
            )}

            {!cargando && !error && productos.length > 0 && (
                <>
                    <ProductCard
                        productos={productos}
                        onAgregar={onAgregar}
                        carrito={carrito}
                    />

                    <nav className="paginacion" aria-label="Paginación">
                        <button
                            type="button"
                            onClick={function () {
                                setPagina(function (actual) {
                                    return actual - 1;
                                });
                            }}
                            disabled={pagina === 0 || cargando}
                        >
                            Anterior
                        </button>

                        <span>
                            Página {pagina + 1} de {totalPaginas}
                        </span>

                        <button
                            type="button"
                            onClick={function () {
                                setPagina(function (actual) {
                                    return actual + 1;
                                });
                            }}
                            disabled={
                                pagina + 1 >= totalPaginas || cargando
                            }
                        >
                            Siguiente
                        </button>
                    </nav>
                </>
            )}
        </section>
    );
}

export default Catalogo;