import ListaCarrito from "../components/ListaCarrito";

function Carrito({ carrito, onEliminar, onAumentar, onDisminuir }) {
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
            />
        </section>
    );
}

export default Carrito;