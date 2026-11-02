import { Link } from "react-router-dom";
import ListaCarrito from "../components/ListaCarrito";

function Carrito({ carrito, onEliminar, onAumentar, onDisminuir, onVaciar }) {
    return (
        <section>
            <div className="titulo-seccion">
                <p>Tu compra</p>
                <h2>Carrito</h2>
            </div>
            <ListaCarrito
                carrito={carrito}
                onEliminar={onEliminar}
                onAumentar={onAumentar}
                onDisminuir={onDisminuir}
                onVaciar={onVaciar}
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