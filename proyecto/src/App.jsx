import { Routes, Route, useLocation } from "react-router-dom";
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
  const { pathname } = useLocation();
  const esLogin = pathname === "/login";
  const esMiCuenta = pathname === "/mi-cuenta";

  return (
    <div className="App">
      <Header />

      <main className={`contenido-principal${esLogin ? " contenido-login" : ""}${esMiCuenta ? " contenido-cuenta" : ""}`}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Catalogo />} />
          <Route path="/producto/:id" element={<Detalle />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/mi-cuenta"
            element={
              <RutaProtegida>
                <MiCuenta />
              </RutaProtegida>
            }
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;