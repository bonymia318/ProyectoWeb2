// El año se calcula una sola vez, al cargar el archivo
const anioActual = new Date().getFullYear();

function Footer() {
    return (
        <footer className="pie-pagina" id="contacto">
            <p>© {anioActual} TechStore Pro. Todos los derechos reservados. Página creada por Karen y Gio</p>
        </footer>
    );
}

export default Footer;