function ListaCarrito({ carrito, onEliminar, onAumentar, onDisminuir, onVaciar }) {
    // Suma de precio por cantidad de cada producto
    let total = 0;
    for (let i = 0; i < carrito.length; i++) {
        total = total + carrito[i].precio * carrito[i].cantidad;
    }

    if (carrito.length === 0) {
        return <p className="carrito-vacio">Aún no agregas productos.</p>;
    }

    return (
        <aside className="carrito-panel">
            <ul className="carrito-lista">
                {carrito.map(function (producto) {
                    return (
                        <li className="carrito-item" key={producto.id}>
                            <div className="carrito-detalle">
                                <strong>{producto.nombre}</strong>
                                <div className="carrito-cantidad">
                                    <button
                                        type="button"
                                        onClick={function () { onDisminuir(producto.id); }}
                                    >
                                        −
                                    </button>
                                    <span>{producto.cantidad}</span>
                                    <button
                                        type="button"
                                        onClick={function () { onAumentar(producto.id); }}
                                        disabled={producto.cantidad >= producto.stock}
                                    >
                                        +
                                    </button>
                                    <span>
                                        Precio: ${producto.precio.toLocaleString("es-MX")}
                                    </span>
                                </div>
                                <p>
                                    Subtotal: $
                                    {(producto.precio * producto.cantidad).toLocaleString("es-MX")}
                                </p>
                            </div>
                            <button
                                className="carrito-eliminar"
                                type="button"
                                onClick={function () { onEliminar(producto.id); }}
                            >
                                Quitar
                            </button>
                        </li>
                    );
                })}
            </ul>

            <div className="carrito-total">
                <span>Total</span>
                <strong>${total.toLocaleString("es-MX")}</strong>
            </div>
            <button
                className="carrito-eliminar"
                type="button"
                onClick={onVaciar}
            >
                Vaciar carrito
            </button>
        </aside>
    );
}

export default ListaCarrito;