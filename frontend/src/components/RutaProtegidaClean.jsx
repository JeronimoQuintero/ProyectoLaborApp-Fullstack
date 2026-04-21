import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext.jsx';

const RutaProtegidaClean = ({ children, soloTrabajador = false }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (soloTrabajador && user.rol !== 'trabajador') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RutaProtegidaClean;
