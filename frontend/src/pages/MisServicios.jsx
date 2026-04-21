import { useEffect, useState } from 'react';
import API from '../api/api';
import CardServicio from '../components/CardServicio.jsx';

const MisServicios = () => {
    const [servicios, setServicios] = useState([]);
    const [error, setError] = useState('');

    const cargarMisServicios = async () => {
        try {
            setError('');
            const res = await API.get('/servicios/mis-servicios');
            setServicios(res.data);
        } catch (error) {
            setError('No fue posible cargar tus publicaciones.');
        }
    };

    useEffect(() => {
        cargarMisServicios();
    }, []);

    const eliminar = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta publicación?")) {
            try {
                await API.delete(`/servicios/${id}`);
                cargarMisServicios(); // Recargar la lista
            } catch (error) {
                alert('No se pudo eliminar el servicio.');
            }
        }
    };

    return (
        <div style={{ padding: '40px 5%', backgroundColor: '#fdfdfd' }}>
            <h2 style={{ color: '#1e293b', marginBottom: '30px' }}>Mis Publicaciones</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
                {servicios.length === 0 ? <p>No has publicado nada aún.</p> : 
                    servicios.map(s => (
                        <div key={s._id} style={{ 
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '20px', background: 'white', borderRadius: '15px',
                            border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                            <div>
                                <h4 style={{ margin: 0, color: '#0f172a' }}>{s.titulo}</h4>
                                <p style={{ margin: '5px 0', color: '#64748b', fontSize: '0.9rem' }}>${s.precio}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={{ background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>Editar</button>
                                <button onClick={() => eliminar(s._id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>Eliminar</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default MisServicios;
