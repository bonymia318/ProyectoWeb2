import { Link } from "react-router-dom";

function Header({ cantidadCarrito }) {
    return (
        <header className="encabezado">
            <div>
                <h1>TechStore Pro</h1>
                <p>Tu tienda de tecnología en línea</p>
            </div>

            <nav className="navegacion">
                <Link to="/">Inicio</Link>
                <Link to="/productos">Productos</Link>
                <Link to="/carrito">Carrito</Link>
            </nav>

            <div className="carrito-resumen">
                🛒 {cantidadCarrito}
            </div>
        </header>
    );
}

export default Header;