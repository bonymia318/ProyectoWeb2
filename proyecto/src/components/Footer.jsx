function Footer() {
    const anioActual = new Date().getFullYear();

    return(
        <footer className='pie-pagina' id='contacto'>
            <p>{anioActual} TechStore Pro 2026. Todos los derechos reservados. Pagina creada por Karen y Gio</p>
        </footer>
    )
}

export default Footer