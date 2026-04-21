import { useEffect, useState } from 'react';
import API from '../api/api.js';
import CardServicio from '../components/CardServicio.jsx';

const Home = () => {
    const [servicios, setServicios] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarServicios = async () => {
            try {
                setError('');
                const res = await API.get('/servicios');
                setServicios(res.data);
            } catch (error) {
                setError('No fue posible cargar los servicios en este momento.');
            } finally {
                setCargando(false);
            }
        };
        cargarServicios();
    }, []);

    const filtrados = servicios.filter(s => 
        s.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        s.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div style={{ backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
            
            {/* HERO SECTION CON COLORES ELEGANTES */}
            <div style={{ 
                background: 'linear-gradient(135deg, #dbe2f3 0%, #bbc8dd 100%)', 
                color: 'white', 
                padding: '100px 20px', 
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: '850', marginBottom: '1.5rem', letterSpacing: '-2px', lineHeight: 1.1 }}>
                    Encuentra expertos en <span style={{ color: '#3b82f6' }}>segundos.</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
                    La red profesional para conectar el talento con el mundo real.
                </p>
                
                <div style={{ maxWidth: '650px', margin: '0 auto', position: 'relative' }}>
                    <input 
                        type="text" 
                        placeholder="Busca por oficio o categoría..." 
                        style={{ 
                            width: '100%', padding: '20px 30px', borderRadius: '20px', 
                            border: '1px solid #334155', fontSize: '1.1rem', backgroundColor: '#1e293b',
                            color: 'white', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)', outline: 'none'
                        }}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* GRILLA DE SERVICIOS MEJORADA */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>Servicios destacados</h2>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{filtrados.length} resultados encontrados</span>
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                    gap: '35px' 
                }}>
                    {cargando && <p style={{ color: '#64748b' }}>Cargando servicios...</p>}
                    {!cargando && error && <p style={{ color: '#dc2626' }}>{error}</p>}
                    {!cargando && !error && filtrados.length === 0 && (
                        <p style={{ color: '#64748b' }}>
                            No se encontraron servicios para esa busqueda.
                        </p>
                    )}
                    {!cargando &&
                        !error &&
                        filtrados.map((s) => (
                            <CardServicio key={s._id} servicio={s} />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
