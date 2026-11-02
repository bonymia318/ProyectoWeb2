import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RutaProtegida from "./components/RutaProtegida";
import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import Detalle from "./pages/Detalle";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import MiCuenta from "./pages/MiCuenta";
import Checkout from "./pages/Checkout";
import NoEncontrada from "./pages/NoEncontrada";
import "./App.css";

function App() {
  // El carrito se lee de localStorage al iniciar, para no perderlo al recargar
  const [carrito, setCarrito] = useState(function () {
    try {
      const carritoGuardado = localStorage.getItem("carrito");

      if (carritoGuardado) {
        const productosGuardados = JSON.parse(carritoGuardado);

        if (Array.isArray(productosGuardados)) {
          return productosGuardados;
        }
      }
    } catch (error) {
      console.error("No se pudo recuperar el carrito de localStorage:", error);
    }

    return [];
  });

  // Guarda el carrito cada vez que cambia
  useEffect(function () {
    try {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } catch (error) {
      console.error("No se pudo guardar el carrito en localStorage:", error);
    }
  }, [carrito]);

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

  // Agrega "cantidad" unidades (1 si no se indica), sin pasar del stock
  function agregarProducto(producto, cantidad) {
    let cantidadAgregar = 1;
    if (cantidad) {
      cantidadAgregar = cantidad;
    }

    setCarrito(function (carritoActual) {
      if (producto.stock <= 0) {
        return carritoActual;
      }

      const existente = carritoActual.find(function (item) {
        return item.id === producto.id;
      });

      if (existente) {
        let nuevaCantidad = existente.cantidad + cantidadAgregar;
        if (nuevaCantidad > producto.stock) {
          nuevaCantidad = producto.stock;
        }

        return carritoActual.map(function (item) {
          if (item.id === producto.id) {
            return { ...item, cantidad: nuevaCantidad };
          }
          return item;
        });
      }

      let cantidadInicial = cantidadAgregar;
      if (cantidadInicial > producto.stock) {
        cantidadInicial = producto.stock;
      }

      return [...carritoActual, { ...producto, cantidad: cantidadInicial }];
    });
  }

  // cambio vale +1 o -1; la cantidad debe quedar entre 1 y el stock
  function cambiarCantidad(id, cambio) {
    setCarrito(function (carritoActual) {
      return carritoActual.map(function (item) {
        if (item.id === id) {
          const nuevaCantidad = item.cantidad + cambio;
          if (nuevaCantidad >= 1 && nuevaCantidad <= item.stock) {
            return { ...item, cantidad: nuevaCantidad };
          }
        }
        return item;
      });
    });
  }

  function eliminarProducto(id) {
    setCarrito(function (carritoActual) {
      return carritoActual.filter(function (item) {
        return item.id !== id;
      });
    });
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  // Suma de todas las cantidades para el contador del encabezado
  let cantidadCarrito = 0;
  for (let i = 0; i < carrito.length; i++) {
    cantidadCarrito = cantidadCarrito + carrito[i].cantidad;
  }

  return (
    <div className="App">
      <Header cantidadCarrito={cantidadCarrito} sesion={sesion} />

      <main className="contenido-principal">
        <Routes>
          <Route
            path="/"
            element={
              <Inicio
                onAgregar={agregarProducto}
                carrito={carrito}
              />
            }
          />
          <Route
            path="/productos"
            element={
              <Catalogo
                onAgregar={agregarProducto}
                carrito={carrito}
              />
            }
          />
          <Route
            path="/producto/:id"
            element={
              <Detalle
                onAgregar={agregarProducto}
                carrito={carrito}
              />
            }
          />
          <Route
            path="/carrito"
            element={
              <Carrito
                carrito={carrito}
                onEliminar={eliminarProducto}
                onAumentar={function (id) { cambiarCantidad(id, 1); }}
                onDisminuir={function (id) { cambiarCantidad(id, -1); }}
                onVaciar={vaciarCarrito}
              />
            }
          />
          <Route path="/login" element={<Login onLogin={guardarSesion} />} />
          <Route
            path="/mi-cuenta"
            element={
              <RutaProtegida sesion={sesion}>
                <MiCuenta sesion={sesion} onCerrarSesion={cerrarSesion} />
              </RutaProtegida>
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                carrito={carrito}
                onVaciar={vaciarCarrito}
              />
            }
          />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;