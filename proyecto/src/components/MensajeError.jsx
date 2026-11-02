// Mensaje de error con botón para volver a intentar la petición
function MensajeError({ mensaje, onReintentar }) {
    return (
        <div className="mensaje-error" role="alert">
            <p>{mensaje}</p>
            <button type="button" onClick={onReintentar}>
                Reintentar
            </button>
        </div>
    );
}

export default MensajeError;