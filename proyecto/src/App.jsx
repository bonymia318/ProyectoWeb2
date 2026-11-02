import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
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
  const [carrito, setCarrito] = useState(function () {
    try {
      const carritoGuardado = localStorage.getItem("carrito");
      const productosGuardados = carritoGuardado
        ? JSON.parse(carritoGuardado)
        : [];

      if (!Array.isArray(productosGuardados)) {
        throw new Error("El contenido guardado del carrito no es válido.");
      }

      return productosGuardados;
    } catch (error) {
      console.error("No se pudo recuperar el carrito de localStorage:", error);
      return [];
    }
  });

  useEffect(function () {
    try {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } catch (error) {
      console.error("No se pudo guardar el carrito en localStorage:", error);
    }
  }, [carrito]);

  // Agrega un producto o suma 1 a su cantidad (sin pasar del stock)
  function agregarProducto(producto) {
    setCarrito(function (carritoActual) {
      if (!Number.isFinite(producto.stock) || producto.stock <= 0) {
        return carritoActual;
      }

      const existente = carritoActual.find(function (item) {
        return item.id === producto.id;
      });

      if (existente) {
        if (existente.cantidad >= producto.stock) {
          return carritoActual;
        }

        return carritoActual.map(function (item) {
          if (item.id === producto.id) {
            return { ...item, cantidad: item.cantidad + 1 };
          }
          return item;
        });
      }

      return [...carritoActual, { ...producto, cantidad: 1 }];
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
    const nuevoCarrito = carrito.filter(function (item) {
      return item.id !== id;
    });
    setCarrito(nuevoCarrito);
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
      <Header cantidadCarrito={cantidadCarrito} />

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
          <Route path="/login" element={<Login />} />
          <Route path="/mi-cuenta" element={<MiCuenta />} />
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