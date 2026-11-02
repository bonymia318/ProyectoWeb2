import { Link } from "react-router-dom";
import ListaCarrito from "../components/ListaCarrito";
import useCarrito from "../hooks/useCarrito";

function Carrito() {
    const {
        carrito,
        cambiarCantidad,
        eliminarProducto,
        vaciarCarrito
    } = useCarrito();

    // Adaptadores: ListaCarrito recibe funciones que solo piden el id
    function aumentar(id) {
        cambiarCantidad(id, 1);
    }

    function disminuir(id) {
        cambiarCantidad(id, -1);
    }

    return (
        <section>
            <div className="titulo-seccion">
                <p>Tu compra</p>
                <h2>Carrito</h2>
            </div>
            <ListaCarrito
                carrito={carrito}
                onEliminar={eliminarProducto}
                onAumentar={aumentar}
                onDisminuir={disminuir}
                onVaciar={vaciarCarrito}
            />
            {carrito.length > 0 && (
                <Link className="boton-principal carrito-checkout" to="/checkout">
                    Continuar al checkout
                </Link>
            )}
        </section>
    );
}

export default Carrito;