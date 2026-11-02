// Lista desplegable de categorías
function FiltroCategoria({ categorias, valor, onCambiar }) {
    return (
        <label>
            Categoría
            <select
                value={valor}
                onChange={function (evento) {
                    onCambiar(evento.target.value);
                }}
            >
                <option value="">Todas las categorías</option>
                {categorias.map(function (item) {
                    return (
                        <option key={item.slug} value={item.slug}>
                            {item.nombre}
                        </option>
                    );
                })}
            </select>
        </label>
    );
}

export default FiltroCategoria;