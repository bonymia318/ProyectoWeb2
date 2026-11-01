import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerProductoPorId } from "../services/apiServices";

function Detalle({ onAgregar, carrito }) {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [imagenSeleccionada, setImagenSeleccionada] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [intento, setIntento] = useState(0);

    useEffect(function () {
        let vigente = true;

        async function cargarProducto() {
            setCargando(true);
            setError("");

            try {
                const resultado = await obtenerProductoPorId(id);

                if (vigente) {
                    setProducto(resultado);
                    setImagenSeleccionada(
                        resultado.imagenes?.[0] || resultado.imagen
                    );
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

        cargarProducto();

        return function () {
            vigente = false;
        };
    }, [id, intento]);

    if (cargando) {
        return <p>Cargando detalle del producto...</p>;
    }

    if (error) {
        return (
            <section role="alert">
                <p>No se pudo cargar el producto: {error}</p>
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
                <p><Link to="/productos">Volver al catálogo</Link></p>
            </section>
        );
    }

    if (!producto) {
        return (
            <section>
                <p>No se encontró el producto.</p>
                <Link to="/productos">Volver al catálogo</Link>
            </section>
        );
    }

    const productoEnCarrito = carrito.find(function (item) {
        return item.id === producto.id;
    });
    const cantidadEnCarrito = productoEnCarrito
        ? productoEnCarrito.cantidad
        : 0;
    const stockDisponible = Math.max(producto.stock - cantidadEnCarrito, 0);
    const imagenes = producto.imagenes?.length
        ? producto.imagenes
        : [producto.imagen];
    const precioConDescuento =
        producto.precio * (1 - producto.descuento / 100);

    return (
        <section className="detalle-producto">
            <div className="detalle-galeria">
                <img
                    className="detalle-imagen-principal"
                    src={imagenSeleccionada}
                    alt={producto.nombre}
                />

                <div className="detalle-miniaturas">
                    {imagenes.map(function (imagen, indice) {
                        return (
                            <button
                                className={
                                    imagen === imagenSeleccionada
                                        ? "detalle-miniatura seleccionada"
                                        : "detalle-miniatura"
                                }
                                type="button"
                                key={`${imagen}-${indice}`}
                                onClick={function () {
                                    setImagenSeleccionada(imagen);
                                }}
                                aria-label={`Ver imagen ${indice + 1}`}
                                aria-pressed={imagen === imagenSeleccionada}
                            >
                                <img src={imagen} alt="" />
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="detalle-informacion">
                <p className="producto_categoria">{producto.categoria}</p>
                <h2>{producto.nombre}</h2>
                <p>{producto.descripcion}</p>
                <p>Marca: {producto.marca || "No especificada"}</p>
                <p>Calificación: ⭐ {producto.calificacion}</p>

                <div className="detalle-precios">
                    <span className="detalle-precio-anterior">
                        ${producto.precio.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </span>
                    <strong>
                        ${precioConDescuento.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </strong>
                    <span className="detalle-descuento">
                        {producto.descuento}% de descuento
                    </span>
                </div>

                <p>
                    {stockDisponible > 0
                        ? `Disponibles para agregar: ${stockDisponible}`
                        : "Producto agotado"}
                </p>

                <button
                    className="detalle-agregar"
                    type="button"
                    onClick={function () {
                        onAgregar(producto);
                    }}
                    disabled={stockDisponible <= 0}
                >
                    {stockDisponible > 0
                        ? "Agregar al carrito"
                        : "Stock agotado"}
                </button>

                <Link className="boton-principal" to="/productos">
                    Volver al catálogo
                </Link>
            </div>

            <section className="detalle-resenas">
                <h3>Reseñas</h3>

                {producto.resenas?.length ? (
                    producto.resenas.map(function (resena, indice) {
                        return (
                            <article
                                className="detalle-resena"
                                key={`${resena.reviewerName}-${resena.date}-${indice}`}
                            >
                                <strong>{resena.reviewerName || "Cliente"}</strong>
                                <p>Calificación: ⭐ {resena.rating}</p>
                                <p>{resena.comment}</p>
                                {resena.date && (
                                    <small>
                                        {resena.date.slice(0, 10)}
                                    </small>
                                )}
                            </article>
                        );
                    })
                ) : (
                    <p>Este producto todavía no tiene reseñas.</p>
                )}
            </section>
        </section>
    );
}

export default Detalle;