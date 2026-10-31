import { Link } from "react-router-dom";

function TarjetaProducto({ producto, onAgregar }) {
    const disponible = producto.stock > 0;

    // Valores por defecto: producto agotado
    let claseStock = "producto_stock producto_stock_agotado";
    let textoStock = "Producto agotado";
    let textoBoton = "No disponible";

    if (disponible) {
        claseStock = "producto_stock producto_stock_disponible";
        textoStock = "Stock: " + producto.stock + " disponibles";
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
                onClick={function () { onAgregar(producto); }}
                disabled={!disponible}
            >
                {textoBoton}
            </button>
        </article>
    );
}

function ProductCard({ productos, onAgregar }) {
    return (
        <div className="catalogo">
            {productos.map(function (producto) {
                return (
                    <TarjetaProducto
                        key={producto.id}
                        producto={producto}
                        onAgregar={onAgregar}
                    />
                );
            })}
        </div>
    );
}

export default ProductCard;