function TarjetaProducto({ producto, onAgregar }) {
    const { nombre, categoria, precio, stock, imagen } = producto;
    const disponible = stock > 0;

    return(
        <article className="producto">
      <div className="producto_icon">
        {imagen ? (
          <img className="producto_imagen" src={imagen} alt={nombre} />
        ) : (
          <span aria-hidden="true"></span>
        )}
      </div>
      <p className="producto_categoria">{categoria}</p>
      <h2 className="producto_nombre">{nombre}</h2>
      <p className="producto_precio">
        ${precio.toLocaleString("es-MX")}
      </p>
      

      <p className={disponible
        ? "producto_stock producto_stock_dosponible"
        : "producto_stock producto_stock_agotado"
      }>
        {disponible ? `Stock: ${stock} unidad disponible`: "Producto agotado"} 
      </p>
      
      <button
        type="button"
        onClick={() => onAgregar(producto)}
        disabled={!disponible}>
          {disponible ? "Agregar al carrito" : "No disponible"}
      </button>
    </article>
    );
}

function ProductCard({ productos, onAgregar }) {
  return (
    <div className="catalogo">
      {productos.map((producto) => (
        <TarjetaProducto
          key={producto.id}
          producto={producto}
          onAgregar={onAgregar}
        />
      ))}
    </div>
  );
}

export default ProductCard;