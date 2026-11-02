import { Link } from "react-router-dom";

function Header({ cantidadCarrito, sesion }) {
    // El enlace cambia según haya o no sesión
    let enlaceSesion = <Link to="/login">Iniciar sesión</Link>;

    if (sesion) {
        enlaceSesion = <Link to="/mi-cuenta">Mi cuenta ({sesion.nombre})</Link>;
    }

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
                {enlaceSesion}
            </nav>

            <div className="carrito-resumen">
                🛒 {cantidadCarrito}
            </div>
        </header>
    );
}

export default Header;