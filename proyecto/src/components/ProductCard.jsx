import { Link } from "react-router-dom";

function TarjetaProducto({ producto, onAgregar, carrito }) {
    const itemEnCarrito = carrito.find(function (item) {
        return item.id === producto.id;
    });
    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
    const stockDisponible = Math.max(producto.stock - cantidadEnCarrito, 0);
    const disponible = stockDisponible > 0;

    let claseStock = "producto_stock producto_stock_agotado";
    let textoStock = "Producto agotado";
    let textoBoton = "Agotado";

    if (disponible) {
        claseStock = "producto_stock producto_stock_disponible";
        textoStock = "Disponibles: " + stockDisponible;
        textoBoton = "Agregar al carrito";
    }

    return (
        <article className="producto">
            <img
                className="producto_imagen"
                src={producto.imagen}
                alt={producto.nombre}
            />
            <p className="producto_categoria">{producto.categoria}</p>
            <h2 className="producto_nombre">
                <Link to={"/producto/" + producto.id}>{producto.nombre}</Link>
            </h2>
            <p className="producto_precio">
                ${producto.precio.toLocaleString("es-MX")}
            </p>
            <p className="producto_calificacion">⭐ {producto.calificacion}</p>
            <p className={claseStock}>{textoStock}</p>
            <button
                type="button"
                onClick={function () {
                    onAgregar(producto);
                }}
                disabled={!disponible}
            >
                {textoBoton}
            </button>
        </article>
    );
}

function ProductCard({ productos, onAgregar, carrito }) {
    return (
        <div className="catalogo">
            {productos.map(function (producto) {
                return (
                    <TarjetaProducto
                        key={producto.id}
                        producto={producto}
                        onAgregar={onAgregar}
                        carrito={carrito}
                    />
                );
            })}
        </div>
    );
}

export default ProductCard;