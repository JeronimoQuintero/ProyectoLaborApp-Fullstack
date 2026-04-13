import { useEffect, useState } from 'react';
import API from '../api/api.js';

const Home = () => {
    const [servicios, setServicios] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const cargarServicios = async () => {
            try {
                const res = await API.get('/servicios');
                setServicios(res.data);
            } catch (error) {
                console.error(error);
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
                    {filtrados.map((s) => (
                        <div key={s._id} style={{ 
                            background: '#ffffff', borderRadius: '24px', overflow: 'hidden',
                            border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            display: 'flex', flexDirection: 'column'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.04)';
                        }}>
                            <div style={{ padding: '30px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <span style={{ 
                                        background: '#ecfdf5', color: '#059669', padding: '6px 16px', 
                                        borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' 
                                    }}>
                                        {s.categoria}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>{s.titulo}</h3>
                                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '1rem' }}>{s.descripcion}</p>
                            </div>

                            <div style={{ 
                                padding: '25px 30px', background: '#f8fafc', 
                                borderTop: '1px solid #f1f5f9', marginTop: 'auto',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                            }}>
                                <div>
                                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                                        ${s.precio.toLocaleString()}
                                    </span>
                                </div>
                                <button style={{ 
                                    background: '#0f172a', color: 'white', border: 'none', 
                                    padding: '12px 24px', borderRadius: '14px', fontWeight: '700',
                                    cursor: 'pointer', fontSize: '0.9rem'
                                }}>
                                    Contactar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;