import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/Authcontext.jsx';
import Home from './pages/HomePage.jsx';
import Login from './pages/LoginPage.jsx';
import Registro from './pages/RegistroPage.jsx';
import CrearServicio from './pages/CrearServicioPage.jsx';
import EditarServicio from './pages/EditarServicioPage.jsx';
import MisServicios from './pages/MisServiciosPage.jsx';
import Navbar from './components/Navbar';
import RutaProtegida from './components/RutaProtegidaClean.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-shell">
          <Navbar />
          <main className="page-shell">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/publicar" element={<RutaProtegida soloTrabajador={true}><CrearServicio /></RutaProtegida>} />
              <Route path="/editar-servicio/:id" element={<RutaProtegida soloTrabajador={true}><EditarServicio /></RutaProtegida>} />
              <Route path="/mis-servicios" element={<RutaProtegida soloTrabajador={true}><MisServicios /></RutaProtegida>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
export default App;
