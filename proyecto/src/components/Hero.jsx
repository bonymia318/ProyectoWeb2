import { Link } from "react-router-dom";

function Hero() {
    return (
        <section className="presentacion" id="inicio">
            <span className="etiqueta">Tienda Universitaria</span>

            <h2>Encuentra tu próximo dispositivo</h2>

            <p>
                Explora una selección de productos para estudiantes
                y desarrolladores.
            </p>

            <Link className="boton-principal" to="/productos">
                Ver productos
            </Link>
        </section>
    );
}

export default Hero;