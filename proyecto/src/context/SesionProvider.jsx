import { useEffect, useState } from "react";
import { SesionContext } from "./SesionContext";

// Proveedor: guarda el usuario que inició sesión, lo persiste
// en localStorage y lo comparte con toda la app
function SesionProvider({ children }) {
  // La sesión se lee de localStorage al iniciar, para no perderla al recargar
  const [sesion, setSesion] = useState(function () {
    try {
      const sesionGuardada = localStorage.getItem("sesion");

      if (sesionGuardada) {
        return JSON.parse(sesionGuardada);
      }
    } catch (error) {
      console.error("No se pudo recuperar la sesión:", error);
    }

    return null;
  });

  // Guarda la sesión cada vez que cambia (o la borra si se cerró)
  useEffect(function () {
    try {
      if (sesion) {
        localStorage.setItem("sesion", JSON.stringify(sesion));
      } else {
        localStorage.removeItem("sesion");
      }
    } catch (error) {
      console.error("No se pudo guardar la sesión:", error);
    }
  }, [sesion]);

  function guardarSesion(usuario) {
    setSesion(usuario);
  }

  function cerrarSesion() {
    setSesion(null);
  }

  // Todo lo que los demás componentes podrán pedir con useSesion()
  const valor = {
    sesion: sesion,
    guardarSesion: guardarSesion,
    cerrarSesion: cerrarSesion
  };

  return (
    <SesionContext.Provider value={valor}>
      {children}
    </SesionContext.Provider>
  );
}

export default SesionProvider;