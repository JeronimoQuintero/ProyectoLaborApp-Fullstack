import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api.js'; // 

const Registro = () => {
    // 1. Estados para guardar lo que el usuario escribe
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        password: '',
        rol: 'cliente',
        oficio: ''
    });

    const navigate = useNavigate();

    // 2. Función para manejar los cambios en los inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Función para enviar los datos al Backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/usuarios/registro', formData);
            alert("¡Registro exitoso! Ahora inicia sesión.");
            navigate('/login'); // Nos manda al login automáticamente
        } catch (error) {
            alert("Error al registrar: " + error.response?.data?.mensaje);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
            <h2>Crea tu cuenta</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input name="nombre" placeholder="Nombre completo" onChange={handleChange} required />
                <input name="correo" type="email" placeholder="Correo electrónico" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
                
                <label>¿Qué eres?</label>
                <select name="rol" onChange={handleChange}>
                    <option value="cliente">Busco servicios (Cliente)</option>
                    <option value="trabajador">Ofrezco servicios (Trabajador)</option>
                </select>

                {/* Si es trabajador, mostramos el campo de oficio */}
                {formData.rol === 'trabajador' && (
                    <input name="oficio" placeholder="Tu oficio (ej: Carpintero)" onChange={handleChange} required />
                )}

                <button type="submit" style={{ padding: '10px', background: '#282c34', color: 'white', cursor: 'pointer' }}>
                    Registrarme
                </button>
            </form>
        </div>
    );
};

export default Registro;