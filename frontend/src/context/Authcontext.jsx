import { createContext, useEffect, useState } from 'react';
import API from '../api/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarSesion = async () => {
            try {
                const res = await API.get('/usuarios/perfil');
                setUser(res.data.usuario || null);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        cargarSesion();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await API.post('/usuarios/logout');
        } catch (error) {
            // Ignore API logout failures and clear local session state.
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
