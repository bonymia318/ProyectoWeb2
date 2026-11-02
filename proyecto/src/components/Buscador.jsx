// Formulario de búsqueda por nombre
function Buscador({ valor, hayBusqueda, onCambiar, onBuscar, onLimpiar }) {
    function enviar(evento) {
        // Evita que el formulario recargue la página
        evento.preventDefault();
        onBuscar();
    }

    let botonLimpiar = null;
    if (hayBusqueda) {
        botonLimpiar = (
            <button type="button" onClick={onLimpiar}>
                Limpiar
            </button>
        );
    }

    return (
        <form className="catalogo-buscador" onSubmit={enviar}>
            <label htmlFor="buscar-productos">Buscar por nombre</label>
            <div className="catalogo-buscador-campos">
                <input
                    id="buscar-productos"
                    type="search"
                    value={valor}
                    onChange={function (evento) {
                        onCambiar(evento.target.value);
                    }}
                    placeholder="Ej. phone, laptop..."
                />
                <button type="submit">Buscar</button>
                {botonLimpiar}
            </div>
        </form>
    );
}

export default Buscador;