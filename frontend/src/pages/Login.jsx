import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import API from '../api/api';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Enviamos los datos al backend
            const res = await API.post('/usuarios/login', { correo, password });
            
            // Si el backend responde bien, guardamos el usuario y el token
            login(res.data.usuario, res.data.token);
            
            alert("¡Bienvenido!");
            navigate('/'); // Nos lleva al inicio después de entrar
        } catch (error) {
            alert("Error al entrar: " + (error.response?.data?.mensaje || "Credenciales incorrectas"));
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
            <h2 style={{ textAlign: 'center' }}>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" 
                    placeholder="Correo electrónico" 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    onChange={e => setCorreo(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    onChange={e => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit" style={{ padding: '12px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;