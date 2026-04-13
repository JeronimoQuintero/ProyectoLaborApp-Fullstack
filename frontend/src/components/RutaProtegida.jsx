import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RutaProtegida = ({ children, soloTrabajador = false }) => {
    const { user } = useContext(AuthContext);

    if (!user) return <Navigate to="/login" />;

    if (soloTrabajador && user.rol !== 'trabajador') {
        alert("Acceso denegado: Esta función es solo para trabajadores.");
        return <Navigate to="/" />;
    }

    return children;
};

export default RutaProtegida;