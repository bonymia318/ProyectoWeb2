// Lista desplegable para ordenar por nombre o precio
function SelectorOrden({ valor, onCambiar }) {
    return (
        <label>
            Ordenar por
            <select
                value={valor}
                onChange={function (evento) {
                    onCambiar(evento.target.value);
                }}
            >
                <option value="title-asc">Nombre: A-Z</option>
                <option value="title-desc">Nombre: Z-A</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
            </select>
        </label>
    );
}

export default SelectorOrden;