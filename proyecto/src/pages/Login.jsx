import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { iniciarSesion } from "../services/authService";
import useSesion from "../hooks/useSesion";

function Login() {
    const { guardarSesion } = useSesion();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    async function enviarFormulario(evento) {
        // Evita que el formulario recargue la página
        evento.preventDefault();

        if (usuario.trim() === "" || contrasena === "") {
            setError("Escribe tu usuario y tu contraseña.");
            return;
        }

        setCargando(true);
        setError("");

        try {
            const datosUsuario = await iniciarSesion(usuario.trim(), contrasena);
            guardarSesion(datosUsuario);
            navigate("/mi-cuenta");
        } catch (e) {
            setError(e.message);
            setCargando(false);
        }
    }

    let textoBoton = "Iniciar sesión";
    if (cargando) {
        textoBoton = "Iniciando sesión...";
    }

    return (
        <section className="login">
            <div className="titulo-seccion">
                <p>Tu cuenta</p>
                <h2>Iniciar sesión</h2>
            </div>

            <form className="login-formulario" onSubmit={enviarFormulario}>
                <div className="login-campo">
                    <label htmlFor="usuario">Usuario</label>
                    <input
                        id="usuario"
                        type="text"
                        value={usuario}
                        onChange={function (evento) {
                            setUsuario(evento.target.value);
                        }}
                    />
                </div>

                <div className="login-campo">
                    <label htmlFor="contrasena">Contraseña</label>
                    <input
                        id="contrasena"
                        type="password"
                        value={contrasena}
                        onChange={function (evento) {
                            setContrasena(evento.target.value);
                        }}
                    />
                </div>

                {error && (
                    <p className="login-error" role="alert">
                        {error}
                    </p>
                )}

                <button type="submit" disabled={cargando}>
                    {textoBoton}
                </button>
            </form>
        </section>
    );
}

export default Login;