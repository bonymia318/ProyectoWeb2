import { useState } from "react";
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
  const [carrito, setCarrito] = useState([]);

  // Agrega un producto o suma 1 a su cantidad (sin pasar del stock)
  function agregarProducto(producto) {
    const existente = carrito.find(function (item) {
      return item.id === producto.id;
    });

    if (existente) {
      if (existente.cantidad >= producto.stock) {
        return;
      }
      const nuevoCarrito = carrito.map(function (item) {
        if (item.id === producto.id) {
          return { ...item, cantidad: item.cantidad + 1 };
        }
        return item;
      });
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  }

  // cambio vale +1 o -1; la cantidad debe quedar entre 1 y el stock
  function cambiarCantidad(id, cambio) {
    const nuevoCarrito = carrito.map(function (item) {
      if (item.id === id) {
        const nuevaCantidad = item.cantidad + cambio;
        if (nuevaCantidad >= 1 && nuevaCantidad <= item.stock) {
          return { ...item, cantidad: nuevaCantidad };
        }
      }
      return item;
    });
    setCarrito(nuevoCarrito);
  }

  function eliminarProducto(id) {
    const nuevoCarrito = carrito.filter(function (item) {
      return item.id !== id;
    });
    setCarrito(nuevoCarrito);
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
          <Route path="/" element={<Inicio onAgregar={agregarProducto} />} />
          <Route path="/productos" element={<Catalogo onAgregar={agregarProducto} />} />
          <Route path="/producto/:id" element={<Detalle />} />
          <Route
            path="/carrito"
            element={
              <Carrito
                carrito={carrito}
                onEliminar={eliminarProducto}
                onAumentar={function (id) { cambiarCantidad(id, 1); }}
                onDisminuir={function (id) { cambiarCantidad(id, -1); }}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/mi-cuenta" element={<MiCuenta />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;