// Texto de carga reutilizable
function Cargando({ mensaje }) {
    let texto = "Cargando...";
    if (mensaje) {
        texto = mensaje;
    }

    return <p className="cargando" role="status">{texto}</p>;
}

export default Cargando;