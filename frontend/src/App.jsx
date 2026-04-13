import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import CrearServicio from './pages/CrearServicio';
import MisServicios from './pages/MisServicios';
import Navbar from './components/Navbar';
import RutaProtegida from './components/RutaProtegida';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/publicar" element={<RutaProtegida soloTrabajador={true}><CrearServicio /></RutaProtegida>} />
          <Route path="/mis-servicios" element={<RutaProtegida soloTrabajador={true}><MisServicios /></RutaProtegida>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;