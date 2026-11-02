import useSesion from "../hooks/useSesion";

function MiCuenta() {
    const { sesion, cerrarSesion } = useSesion();

    return (
        <section className="cuenta">
            <div className="titulo-seccion">
                <p>Tu perfil</p>
                <h2>Mi cuenta</h2>
            </div>

            <div className="cuenta-tarjeta">
                <img
                    className="cuenta-foto"
                    src={sesion.imagen}
                    alt={sesion.nombre}
                />
                <h3>{sesion.nombre}</h3>
                <p>Correo: {sesion.correo}</p>
                <p>Usuario: {sesion.usuario}</p>

                <button type="button" onClick={cerrarSesion}>
                    Cerrar sesión
                </button>
            </div>
        </section>
    );
}

export default MiCuenta;