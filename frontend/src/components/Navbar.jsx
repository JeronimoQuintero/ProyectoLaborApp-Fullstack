import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav style={{ 
            background: '#ffffff', padding: '1rem 5%', display: 'flex', 
            justifyContent: 'space-between', alignItems: 'center', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 1000 
        }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#3b82f6', fontWeight: '800', fontSize: '1.4rem' }}>
                LaborApp
            </Link>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#64748b' }}>Inicio</Link>
                
                {user ? (
                    <>
                        {user.rol === 'trabajador' && (
                            <>
                                <Link to="/publicar" style={{ textDecoration: 'none', color: '#3b82f6', fontWeight: '600' }}>Publicar</Link>
                                <Link to="/mis-servicios" style={{ textDecoration: 'none', color: '#64748b' }}>Mis Oficios</Link>
                            </>
                        )}
                        <span style={{ color: '#1e293b', fontWeight: '500' }}>Hi, {user.nombre}</span>
                        <button onClick={logout} style={{ background: '#f1f5f9', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>Salir</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ textDecoration: 'none', color: '#64748b' }}>Login</Link>
                        <Link to="/registro" style={{ textDecoration: 'none', background: '#3b82f6', color: 'white', padding: '8px 18px', borderRadius: '10px' }}>Empezar</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;