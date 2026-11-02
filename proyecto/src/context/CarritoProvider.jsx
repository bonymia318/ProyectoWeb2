import { useEffect, useState } from "react";
import { CarritoContext } from "./CarritoContext";

// Proveedor: guarda el carrito, lo persiste en localStorage
// y lo comparte con todos los componentes de la app
function CarritoProvider({ children }) {
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

  // Cantidad total de unidades (contador del encabezado) y total a pagar
  let cantidadCarrito = 0;
  let total = 0;
  for (let i = 0; i < carrito.length; i++) {
    cantidadCarrito = cantidadCarrito + carrito[i].cantidad;
    total = total + carrito[i].precio * carrito[i].cantidad;
  }

  // Todo lo que los demás componentes podrán pedir con useCarrito()
  const valor = {
    carrito: carrito,
    cantidadCarrito: cantidadCarrito,
    total: total,
    agregarProducto: agregarProducto,
    cambiarCantidad: cambiarCantidad,
    eliminarProducto: eliminarProducto,
    vaciarCarrito: vaciarCarrito
  };

  return (
    <CarritoContext.Provider value={valor}>
      {children}
    </CarritoContext.Provider>
  );
}

export default CarritoProvider;