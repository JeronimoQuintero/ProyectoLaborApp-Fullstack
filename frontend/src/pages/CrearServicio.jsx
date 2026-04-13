import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

const CrearServicio = () => {
    const [form, setForm] = useState({ titulo: '', descripcion: '', precio: '', categoria: 'Hogar' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // El token se envía solo gracias al interceptor que hicimos en api.js
            await API.post('/servicios', form);
            alert("¡Servicio publicado con éxito!");
            navigate('/'); // Regresa al inicio para ver la nueva tarjeta
        } catch (error) {
            alert("Error al publicar: " + (error.response?.data?.mensaje || "Verifica tu sesión"));
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #eee', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Publicar mi Servicio</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    placeholder="Título (ej: Reparación de Computadores)" 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    onChange={e => setForm({...form, titulo: e.target.value})} 
                    required 
                />
                <textarea 
                    placeholder="Describe detalladamente qué ofreces..." 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '100px' }}
                    onChange={e => setForm({...form, descripcion: e.target.value})} 
                    required 
                />
                <input 
                    type="number" 
                    placeholder="Precio sugerido (Ej: 50000)" 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    onChange={e => setForm({...form, precio: e.target.value})} 
                    required 
                />
                <select 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    onChange={e => setForm({...form, categoria: e.target.value})}
                >
                    <option value="Hogar">Hogar (Limpieza, Reparaciones)</option>
                    <option value="Tecnología">Tecnología (Soporte, Desarrollo)</option>
                    <option value="Enseñanza">Enseñanza (Clases, Tutorías)</option>
                    <option value="Otros">Otros</option>
                </select>
                <button type="submit" style={{ padding: '12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Subir Publicación
                </button>
            </form>
        </div>
    );
};

export default CrearServicio;