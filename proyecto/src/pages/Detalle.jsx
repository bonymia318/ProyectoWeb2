import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerProductoPorId } from "../services/apiServices";
import useCarrito from "../hooks/useCarrito";
import Cargando from "../components/Cargando";
import MensajeError from "../components/MensajeError";

function Detalle() {
    // El carrito viene del contexto; los hooks siempre van antes de los return
    const { carrito, agregarProducto } = useCarrito();
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [imagenSeleccionada, setImagenSeleccionada] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [intento, setIntento] = useState(0);

    // Carga el producto cada vez que cambia el id o se pulsa "Reintentar"
    useEffect(function () {
        let vigente = true;

        async function cargarProducto() {
            setCargando(true);
            setError("");

            try {
                const resultado = await obtenerProductoPorId(id);

                if (vigente) {
                    setProducto(resultado);

                    // La primera imagen de la galería, o la miniatura si no hay galería
                    let primeraImagen = resultado.imagen;
                    if (resultado.imagenes && resultado.imagenes.length > 0) {
                        primeraImagen = resultado.imagenes[0];
                    }
                    setImagenSeleccionada(primeraImagen);
                    setCantidad(1);
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
        return <Cargando mensaje="Cargando detalle del producto..." />;
    }

    if (error) {
        return (
            <section>
                <MensajeError
                    mensaje={"No se pudo cargar el producto: " + error}
                    onReintentar={function () {
                        setIntento(intento + 1);
                    }}
                />
                <Link className="boton-principal" to="/productos">
                    Volver al catálogo
                </Link>
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

    // Cuántas unidades de este producto ya están en el carrito
    let cantidadEnCarrito = 0;
    const productoEnCarrito = carrito.find(function (item) {
        return item.id === producto.id;
    });
    if (productoEnCarrito) {
        cantidadEnCarrito = productoEnCarrito.cantidad;
    }

    // Lo que todavía se puede agregar sin pasar del stock
    let stockDisponible = producto.stock - cantidadEnCarrito;
    if (stockDisponible < 0) {
        stockDisponible = 0;
    }

    // Lista de imágenes para la galería
    let imagenes = [producto.imagen];
    if (producto.imagenes && producto.imagenes.length > 0) {
        imagenes = producto.imagenes;
    }

    let marca = "No especificada";
    if (producto.marca) {
        marca = producto.marca;
    }

    let textoStock = "Producto agotado";
    if (stockDisponible > 0) {
        textoStock = "Disponibles para agregar: " + stockDisponible;
    }

    const precioConDescuento = producto.precio * (1 - producto.descuento / 100);

    const opcionesPrecio = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    };

    // Sube la cantidad sin pasar del stock disponible
    function aumentarCantidad() {
        if (cantidad < stockDisponible) {
            setCantidad(cantidad + 1);
        }
    }

    // Baja la cantidad sin bajar de 1
    function disminuirCantidad() {
        if (cantidad > 1) {
            setCantidad(cantidad - 1);
        }
    }

    function agregarAlCarrito() {
        agregarProducto(producto, cantidad);
        setCantidad(1);
    }

    // Contenido de la sección de reseñas
    let contenidoResenas = <p>Este producto todavía no tiene reseñas.</p>;
    if (producto.resenas && producto.resenas.length > 0) {
        contenidoResenas = producto.resenas.map(function (resena, indice) {
            return (
                <article
                    className="detalle-resena"
                    key={resena.reviewerName + "-" + indice}
                >
                    <strong>{resena.reviewerName}</strong>
                    <p>Calificación: ⭐ {resena.rating}</p>
                    <p>{resena.comment}</p>
                </article>
            );
        });
    }

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
                        let claseMiniatura = "detalle-miniatura";
                        if (imagen === imagenSeleccionada) {
                            claseMiniatura = "detalle-miniatura seleccionada";
                        }

                        return (
                            <button
                                className={claseMiniatura}
                                type="button"
                                key={indice}
                                onClick={function () {
                                    setImagenSeleccionada(imagen);
                                }}
                                aria-label={"Ver imagen " + (indice + 1)}
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
                <p>Marca: {marca}</p>
                <p>Calificación: ⭐ {producto.calificacion}</p>

                <div className="detalle-precios">
                    <span className="detalle-precio-anterior">
                        ${producto.precio.toLocaleString("es-MX", opcionesPrecio)}
                    </span>
                    <strong>
                        ${precioConDescuento.toLocaleString("es-MX", opcionesPrecio)}
                    </strong>
                    <span className="detalle-descuento">
                        {producto.descuento}% de descuento
                    </span>
                </div>

                <p>{textoStock}</p>

                <div className="detalle-cantidad">
                    <button
                        type="button"
                        onClick={disminuirCantidad}
                        disabled={cantidad <= 1}
                    >
                        −
                    </button>
                    <span>{cantidad}</span>
                    <button
                        type="button"
                        onClick={aumentarCantidad}
                        disabled={cantidad >= stockDisponible}
                    >
                        +
                    </button>
                </div>

                <button
                    className="detalle-agregar"
                    type="button"
                    onClick={agregarAlCarrito}
                    disabled={stockDisponible <= 0}
                >
                    Agregar al carrito
                </button>

                <Link className="boton-principal" to="/productos">
                    Volver al catálogo
                </Link>
            </div>

            <section className="detalle-resenas">
                <h3>Reseñas</h3>
                {contenidoResenas}
            </section>
        </section>
    );
}

export default Detalle;