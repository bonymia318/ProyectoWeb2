function Carrito({ carrito, inventario, onEliminar, onAumentar, onDisminuir }) {
  const total = carrito.reduce(
    (suma, producto) => suma + producto.precio * producto.cantidad,
    0
  );
  return (
    <aside className="carrito-panel" id="carrito" aria-label="Carrito de compras">
      <div className="carrito-encabezado">
        <div>
          <p className="carrito-etiqueta">Tu compra</p>
          <h2>Carrito</h2>
        </div>
      </div>

      {carrito.length === 0 ? (
        <p className="carrito-vacio">Aún no agregas productos.</p>
      ) : (
        <ul className="carrito-lista">
          {carrito.map((producto) => (
            <li className="carrito-item" key={producto.id}>
              <span className="carrito-icono" aria-hidden="true">
                {producto.icono}
              </span>
              <div className="carrito-detalle">
                <strong>{producto.nombre}</strong>
                <div className="carrito-cantidad">
                  <button
                    type="button"
                    onClick={() => onDisminuir(producto.id)}
                    aria-label={`Disminuir cantidad de ${producto.nombre}`}
                  >
                    −
                  </button>
                  <span>{producto.cantidad}</span>
                  <button
                    type="button"
                    onClick={() => onAumentar(producto.id)}
                    disabled={
                      (inventario.find((item) => item.id === producto.id)?.stock ?? 0) <=
                      producto.cantidad
                    }
                    aria-label={`Aumentar cantidad de ${producto.nombre}`}
                  >
                    +
                  </button>
                  <span>
                    × ${producto.precio.toLocaleString("es-MX")}
                  </span>
                </div>
              </div>
              <button
                className="carrito-eliminar"
                type="button"
                onClick={() => onEliminar(producto.id)}
                aria-label={`Quitar ${producto.nombre} del carrito`}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="carrito-total">
        <span>Total</span>
        <strong>${total.toLocaleString("es-MX")}</strong>
      </div>
    </aside>
  );
}

export default Carrito;