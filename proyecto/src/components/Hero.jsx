import { Link } from "react-router-dom";

function Hero() {
    return (
        <section className="presentacion" id="inicio">
            <div className="presentacion-contenido">
                <span className="etiqueta">Tienda Universitaria</span>

                <h2>Encuentra tu próximo dispositivo</h2>

                <p>
                    Explora una selección de productos para estudiantes
                    y desarrolladores.
                </p>

                <Link className="boton-principal" to="/productos">
                    Ver productos
                </Link>
            </div>

            <div className="hero-beneficios" aria-label="Beneficios de la tienda">
                <div className="beneficio beneficio-productos">
                    <strong>+100</strong>
                    <span>productos disponibles</span>
                </div>
                <div className="beneficio beneficio-envio">
                    <strong>Envío rápido</strong>
                    <span>A todo el campus</span>
                </div>
                <div className="beneficio beneficio-pago">
                    <strong>Pago seguro</strong>
                    <span>Compra con confianza</span>
                </div>
            </div>
        </section>
    );
}

export default Hero;