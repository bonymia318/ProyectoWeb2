const URL_BASE = "https://dummyjson.com";

// Convierte la respuesta de la API al formato que usa nuestra app
function adaptarUsuario(datos) {
    return {
        id: datos.id,
        usuario: datos.username,
        correo: datos.email,
        nombre: datos.firstName + " " + datos.lastName,
        imagen: datos.image,
        token: datos.accessToken
    };
}

// Envía usuario y contraseña; regresa el usuario o lanza un error
export async function iniciarSesion(usuario, contrasena) {
    let respuesta;

    try {
        respuesta = await fetch(URL_BASE + "/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: usuario,
                password: contrasena
            })
        });
    } catch {
        throw new Error("No se pudo conectar con el servidor.");
    }

    // La API responde 400 cuando las credenciales son incorrectas
    if (respuesta.status === 400) {
        throw new Error("Usuario o contraseña incorrectos.");
    }

    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status + " al iniciar sesión.");
    }

    const datos = await respuesta.json();
    return adaptarUsuario(datos);
}