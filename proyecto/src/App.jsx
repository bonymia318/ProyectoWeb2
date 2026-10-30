import { useEffect, useState } from "react";
import { obtenerProducto } from "./service/apiService";
import Carrito from "./components/Carrito.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import ProductCard from "./components/ProductCard.jsx";
import "./App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function cargarProductos() {
      try {
        setProductos(await obtenerProducto());
      } catch (error) {
        setMensaje(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, []);

  function agregarProducto(producto) {
    setCarrito((actual) => {
      const existente = actual.find((item) => item.id === producto.id);
      if (existente?.cantidad >= producto.stock) return actual;

      return existente
        ? actual.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          )
        : [...actual, { ...producto, cantidad: 1 }];
    });
  }

  function cambiarCantidad(id, cambio) {
    setCarrito((actual) =>
      actual
        .map((item) => {
          if (item.id !== id) return item;
          const cantidad = item.cantidad + cambio;
          return cantidad > 0 && cantidad <= item.stock
            ? { ...item, cantidad }
            : item;
        })
        .filter((item) => item.cantidad > 0)
    );
  }

  const cantidadCarrito = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );

  return (
    <div className="App">
      <Header cantidadCarrito={cantidadCarrito} />
      <main className="contenido-principal">
        <Hero />
        <div className="tienda-layout">
          <section className="seccion-productos" id="productos">
            <div className="titulo-seccion">
              <p>Catálogo</p>
              <h2>Productos Destacados</h2>
            </div>
            {cargando && <p>Cargando productos...</p>}
            {mensaje && <p role="alert">{mensaje}</p>}
            {!cargando && !mensaje && (
              <ProductCard productos={productos} onAgregar={agregarProducto} />
            )}
          </section>
          <Carrito
            carrito={carrito}
            inventario={productos}
            onEliminar={(id) =>
              setCarrito((actual) => actual.filter((item) => item.id !== id))
            }
            onAumentar={(id) => cambiarCantidad(id, 1)}
            onDisminuir={(id) => cambiarCantidad(id, -1)}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
