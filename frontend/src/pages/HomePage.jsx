import { useEffect, useState } from 'react';
import API from '../api/api.js';
import ServiceCard from '../components/ServiceCard.jsx';
import { categoriasOficio } from '../data/oficios.js';

const HomePage = () => {
    const [servicios, setServicios] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarServicios = async () => {
            try {
                setError('');
                const res = await API.get('/servicios');
                setServicios(res.data);
            } catch (err) {
                setError('No fue posible cargar los servicios en este momento.');
            } finally {
                setCargando(false);
            }
        };

        cargarServicios();
    }, []);

    const contactarServicio = (servicio) => {
        if (!servicio.usuario?.correo && !servicio.usuario?.telefono) {
            setError('Este trabajador aun no tiene correo ni celular disponibles para contacto.');
            return;
        }
    };

    const filtrados = servicios.filter((servicio) =>
        (categoriaSeleccionada === 'Todas' || servicio.categoria === categoriaSeleccionada) &&
        (
            servicio.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
            servicio.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
            servicio.oficio?.toLowerCase().includes(busqueda.toLowerCase()) ||
            servicio.usuario?.oficio?.toLowerCase().includes(busqueda.toLowerCase())
        )
    );

    return (
        <div>
            <section className="hero-panel">
                <div className="hero-grid">
                    <div>
                        <span className="eyebrow">Talento local verificado</span>
                        <h1 className="hero-title">Encuentra personas expertas para resolver lo importante.</h1>
                        <p className="hero-copy">
                            Publica, descubre y conecta con trabajadores independientes en una plataforma
                            clara, cercana y profesional.
                        </p>

                        <div className="search-card">
                            <input
                                className="search-field"
                                type="text"
                                placeholder="Busca por oficio o categoria"
                                value={busqueda}
                                onChange={(event) => setBusqueda(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-card">
                            <span className="stat-value">{servicios.length}</span>
                            <p>Servicios publicados en el tablero principal.</p>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{new Set(servicios.map((item) => item.categoria)).size || 0}</span>
                            <p>Categorias visibles para que el usuario encuentre opciones rapido.</p>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">24h</span>
                            <p>Autenticacion y publicacion disponibles con tu backend actual.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="section-head">
                    <div>
                        <h2 className="section-title">Servicios destacados</h2>
                        <p className="section-copy">
                            Una vista limpia para explorar ofertas por categoria, precio y perfil del trabajador.
                        </p>
                    </div>
                    <p className="section-copy">{filtrados.length} resultados encontrados</p>
                </div>

                <div className="filter-row">
                    <button
                        type="button"
                        onClick={() => setCategoriaSeleccionada('Todas')}
                        className={categoriaSeleccionada === 'Todas' ? 'button' : 'button-ghost'}
                    >
                        Todas
                    </button>
                    {categoriasOficio.map((categoria) => (
                        <button
                            key={categoria}
                            type="button"
                            onClick={() => setCategoriaSeleccionada(categoria)}
                            className={categoriaSeleccionada === categoria ? 'button' : 'button-ghost'}
                        >
                            {categoria}
                        </button>
                    ))}
                </div>

                {cargando && <div className="surface-card empty-state">Cargando servicios...</div>}
                {!cargando && error && <div className="feedback">{error}</div>}
                {!cargando && !error && filtrados.length === 0 && (
                    <div className="surface-card empty-state">
                        No encontramos servicios para esa busqueda. Intenta con otra categoria u oficio.
                    </div>
                )}

                {!cargando && !error && filtrados.length > 0 && (
                    <div className="cards-grid">
                        {filtrados.map((servicio) => (
                            <ServiceCard
                                key={servicio._id}
                                servicio={servicio}
                                accion={() => contactarServicio(servicio)}
                                accionLabel="Contactar"
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;
