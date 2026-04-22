import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext.jsx';

const RutaProtegida = ({ children, soloTrabajador = false }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="surface-card empty-state">Validando sesion...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (soloTrabajador && user.rol !== 'trabajador') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RutaProtegida;

