import { useState } from "react";
import { Link } from "react-router-dom";
import useCarrito from "../hooks/useCarrito";

const CAMPOS_INICIALES = {
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: ""
};

// Regresa el mensaje de error de un campo, o "" si está bien
function validarCampo(campo, valor) {
    const texto = valor.trim();

    if (!texto) {
        return "Este campo es obligatorio.";
    }

    if (campo === "nombre" && texto.length < 2) {
        return "Escribe tu nombre completo.";
    }

    if (
        campo === "correo" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto)
    ) {
        return "Escribe un correo electrónico válido.";
    }

    if (campo === "telefono" && !/^\d{10}$/.test(texto)) {
        return "El teléfono debe tener exactamente 10 dígitos.";
    }

    if (campo === "direccion" && texto.length < 5) {
        return "Escribe una dirección más completa.";
    }

    if (campo === "codigoPostal" && !/^\d{5}$/.test(texto)) {
        return "El código postal debe tener 5 dígitos.";
    }

    return "";
}

function formatoMoneda(cantidad) {
    return cantidad.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });
}

function Checkout() {
    const { carrito, vaciarCarrito } = useCarrito();
    const [valores, setValores] = useState(CAMPOS_INICIALES);
    const [errores, setErrores] = useState({});
    const [tocados, setTocados] = useState({});
    const [confirmacion, setConfirmacion] = useState(null);

    const total = carrito.reduce(function (suma, producto) {
        return suma + producto.precio * producto.cantidad;
    }, 0);

    function cambiarCampo(evento) {
        const { name, value } = evento.target;
        const nuevosValores = { ...valores, [name]: value };
        setValores(nuevosValores);

        if (tocados[name]) {
            setErrores(function (erroresActuales) {
                return {
                    ...erroresActuales,
                    [name]: validarCampo(name, value)
                };
            });
        }
    }

    function validarAlSalir(evento) {
        const { name, value } = evento.target;
        setTocados(function (tocadosActuales) {
            return { ...tocadosActuales, [name]: true };
        });
        setErrores(function (erroresActuales) {
            return {
                ...erroresActuales,
                [name]: validarCampo(name, value)
            };
        });
    }

    function finalizarCompra(evento) {
        evento.preventDefault();

        const nuevosErrores = {};
        Object.keys(CAMPOS_INICIALES).forEach(function (campo) {
            nuevosErrores[campo] = validarCampo(campo, valores[campo]);
        });
        setErrores(nuevosErrores);
        setTocados({
            nombre: true,
            correo: true,
            telefono: true,
            direccion: true,
            ciudad: true,
            codigoPostal: true
        });

        if (Object.values(nuevosErrores).some(Boolean) || carrito.length === 0) {
            return;
        }

        // Se guarda una copia del pedido antes de vaciar el carrito
        setConfirmacion({
            productos: carrito.map(function (producto) {
                return { ...producto };
            }),
            total
        });
        vaciarCarrito();
    }

    if (confirmacion) {
        return (
            <section className="checkout-confirmacion" aria-live="polite">
                <p className="checkout-etiqueta">Compra completada</p>
                <h2>¡Gracias por tu compra, {valores.nombre.trim()}!</h2>
                <p>
                    Tu pedido ha sido registrado correctamente.
                </p>

                <h3>Resumen de compra</h3>
                <ul className="checkout-resumen-lista">
                    {confirmacion.productos.map(function (producto) {
                        return (
                            <li key={producto.id}>
                                <span>
                                    {producto.nombre} × {producto.cantidad}
                                </span>
                                <strong>
                                    {formatoMoneda(
                                        producto.precio * producto.cantidad
                                    )}
                                </strong>
                            </li>
                        );
                    })}
                </ul>
                <p className="checkout-total">
                    Total pagado: <strong>{formatoMoneda(confirmacion.total)}</strong>
                </p>
                <p>El carrito se ha vaciado.</p>
                <Link className="boton-principal" to="/productos">
                    Seguir comprando
                </Link>
            </section>
        );
    }

    if (carrito.length === 0) {
        return (
            <section className="checkout-vacio">
                <h2>No hay productos para comprar</h2>
                <p>Agrega productos al carrito antes de continuar.</p>
                <Link className="boton-principal" to="/productos">
                    Ir al catálogo
                </Link>
            </section>
        );
    }

    const campos = [
        { nombre: "nombre", etiqueta: "Nombre completo", tipo: "text", autoComplete: "name" },
        { nombre: "correo", etiqueta: "Correo electrónico", tipo: "email", autoComplete: "email" },
        { nombre: "telefono", etiqueta: "Teléfono", tipo: "tel", autoComplete: "tel" },
        { nombre: "direccion", etiqueta: "Dirección", tipo: "text", autoComplete: "street-address" },
        { nombre: "ciudad", etiqueta: "Ciudad", tipo: "text", autoComplete: "address-level2" },
        { nombre: "codigoPostal", etiqueta: "Código postal", tipo: "text", autoComplete: "postal-code" }
    ];

    return (
        <section className="checkout">
            <div className="titulo-seccion">
                <p>Último paso</p>
                <h2>Finalizar compra</h2>
            </div>

            <div className="checkout-contenido">
                <form
                    className="checkout-formulario"
                    onSubmit={finalizarCompra}
                    noValidate
                >
                    <h3>Datos de entrega</h3>

                    {campos.map(function (campo) {
                        const errorVisible = tocados[campo.nombre] && errores[campo.nombre];
                        const idError = `${campo.nombre}-error`;

                        // Teléfono y código postal abren el teclado numérico en el celular
                        let modoEntrada = undefined;
                        if (campo.nombre === "telefono" || campo.nombre === "codigoPostal") {
                            modoEntrada = "numeric";
                        }

                        // Solo se enlaza el mensaje de error si está visible
                        let descripcionError = undefined;
                        if (errorVisible) {
                            descripcionError = idError;
                        }

                        return (
                            <div className="checkout-campo" key={campo.nombre}>
                                <label htmlFor={campo.nombre}>{campo.etiqueta}</label>
                                <input
                                    id={campo.nombre}
                                    name={campo.nombre}
                                    type={campo.tipo}
                                    value={valores[campo.nombre]}
                                    onChange={cambiarCampo}
                                    onBlur={validarAlSalir}
                                    autoComplete={campo.autoComplete}
                                    inputMode={modoEntrada}
                                    aria-required="true"
                                    aria-invalid={Boolean(errorVisible)}
                                    aria-describedby={descripcionError}
                                />
                                {errorVisible && (
                                    <p className="checkout-error" id={idError} role="alert">
                                        {errores[campo.nombre]}
                                    </p>
                                )}
                            </div>
                        );
                    })}

                    <button className="checkout-confirmar" type="submit">
                        Confirmar compra
                    </button>
                </form>

                <aside className="checkout-resumen">
                    <h3>Resumen del pedido</h3>
                    <ul className="checkout-resumen-lista">
                        {carrito.map(function (producto) {
                            return (
                                <li key={producto.id}>
                                    <span>
                                        {producto.nombre} × {producto.cantidad}
                                    </span>
                                    <strong>
                                        {formatoMoneda(
                                            producto.precio * producto.cantidad
                                        )}
                                    </strong>
                                </li>
                            );
                        })}
                    </ul>
                    <p className="checkout-total">
                        Total: <strong>{formatoMoneda(total)}</strong>
                    </p>
                    <Link to="/carrito">Volver al carrito</Link>
                </aside>
            </div>
        </section>
    );
}

export default Checkout;