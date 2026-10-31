import { Link } from "react-router-dom";

function NoEncontrada() {
    return (
        <section>
            <h2>404 - Página no encontrada</h2>
            <p>La ruta que buscas no existe.</p>
            <Link className="boton-principal" to="/">Volver al inicio</Link>
        </section>
    );
}

export default NoEncontrada;