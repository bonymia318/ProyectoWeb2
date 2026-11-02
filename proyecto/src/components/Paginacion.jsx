// Botones Anterior / Siguiente con el número de página actual
function Paginacion({ pagina, totalPaginas, onAnterior, onSiguiente }) {
    return (
        <nav className="paginacion" aria-label="Paginación">
            <button type="button" onClick={onAnterior} disabled={pagina === 0}>
                Anterior
            </button>

            <span>
                Página {pagina + 1} de {totalPaginas}
            </span>

            <button
                type="button"
                onClick={onSiguiente}
                disabled={pagina + 1 >= totalPaginas}
            >
                Siguiente
            </button>
        </nav>
    );
}

export default Paginacion;