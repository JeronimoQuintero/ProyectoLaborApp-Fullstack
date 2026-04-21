import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/Authcontext.jsx';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="topbar">
            <Link to="/" className="brand">
                <span className="brand-mark">LA</span>
                <span className="brand-copy">
                    <span className="brand-title">LaborApp</span>
                    <span className="brand-subtitle">Servicios de confianza cerca de ti</span>
                </span>
            </Link>

            <div className="nav-cluster">
                <div className="nav-links">
                    <Link to="/" className="nav-link">Inicio</Link>
                </div>

                {user ? (
                    <div className="nav-actions">
                        {user.rol === 'trabajador' && (
                            <>
                                <Link to="/publicar" className="nav-link">Publicar</Link>
                                <Link to="/mis-servicios" className="nav-link">Mis servicios</Link>
                            </>
                        )}
                        <span className="nav-user">{user.nombre}</span>
                        <button onClick={logout} className="button-ghost">Salir</button>
                    </div>
                ) : (
                    <div className="nav-actions">
                        <Link to="/login" className="nav-link">Ingresar</Link>
                        <Link to="/registro" className="button">Crear cuenta</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
