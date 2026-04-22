import { useEffect, useMemo, useState } from 'react';
import API from '../api/api.js';
import ServiceCard from '../components/ServiceCard.jsx';
import { categoriasOficio } from '../data/oficios.js';

const HomePage = () => {
    const [servicios, setServicios] = useState([]);
    const [busquedaInput, setBusquedaInput] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
    const [minPrecio, setMinPrecio] = useState('');
    const [maxPrecio, setMaxPrecio] = useState('');
    const [orden, setOrden] = useState('createdAt-desc');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({
        page: 1,
        limit: 9,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setBusqueda(busquedaInput.trim());
        }, 350);

        return () => clearTimeout(timeout);
    }, [busquedaInput]);

    useEffect(() => {
        setPage(1);
    }, [busqueda, categoriaSeleccionada, minPrecio, maxPrecio, orden]);

    useEffect(() => {
        const cargarServicios = async () => {
            try {
                setCargando(true);
                setError('');

                const [sortBy, sortDir] = orden.split('-');
                const params = {
                    page,
                    limit: 9,
                    sortBy,
                    sortDir,
                };

                if (busqueda) {
                    params.q = busqueda;
                }

                if (categoriaSeleccionada !== 'Todas') {
                    params.categoria = categoriaSeleccionada;
                }

                if (minPrecio.trim()) {
                    params.minPrecio = minPrecio.trim();
                }

                if (maxPrecio.trim()) {
                    params.maxPrecio = maxPrecio.trim();
                }

                const res = await API.get('/servicios', { params });

                if (Array.isArray(res.data)) {
                    setServicios(res.data);
                    setMeta({
                        page: 1,
                        limit: res.data.length || 9,
                        total: res.data.length,
                        totalPages: 1,
                        hasNextPage: false,
                        hasPrevPage: false,
                    });
                } else {
                    setServicios(res.data.items || []);
                    setMeta(
                        res.data.meta || {
                            page: 1,
                            limit: 9,
                            total: 0,
                            totalPages: 1,
                            hasNextPage: false,
                            hasPrevPage: false,
                        }
                    );
                }
            } catch (err) {
                setError(err.response?.data?.mensaje || 'No fue posible cargar los servicios en este momento.');
            } finally {
                setCargando(false);
            }
        };

        cargarServicios();
    }, [busqueda, categoriaSeleccionada, minPrecio, maxPrecio, orden, page]);

    const contactarServicio = (servicio) => {
        if (!servicio.usuario?.correo && !servicio.usuario?.telefono) {
            setError('Este trabajador aun no tiene correo ni celular disponibles para contacto.');
        }
    };

    const categoriasVisibles = useMemo(() => ['Todas', ...categoriasOficio], []);

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

                        <div className="search-card" style={{ display: 'grid', gap: '0.75rem' }}>
                            <input
                                className="search-field"
                                type="text"
                                placeholder="Busca por oficio, titulo o categoria"
                                value={busquedaInput}
                                onChange={(event) => setBusquedaInput(event.target.value)}
                            />

                            <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                                <input
                                    className="input"
                                    type="number"
                                    min="0"
                                    placeholder="Precio minimo"
                                    value={minPrecio}
                                    onChange={(event) => setMinPrecio(event.target.value)}
                                />
                                <input
                                    className="input"
                                    type="number"
                                    min="0"
                                    placeholder="Precio maximo"
                                    value={maxPrecio}
                                    onChange={(event) => setMaxPrecio(event.target.value)}
                                />
                                <select
                                    className="select"
                                    value={orden}
                                    onChange={(event) => setOrden(event.target.value)}
                                >
                                    <option value="createdAt-desc">Mas recientes</option>
                                    <option value="precio-asc">Precio menor a mayor</option>
                                    <option value="precio-desc">Precio mayor a menor</option>
                                    <option value="titulo-asc">Titulo A-Z</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-card">
                            <span className="stat-value">{meta.total}</span>
                            <p>Servicios encontrados con los filtros actuales.</p>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{categoriasOficio.length}</span>
                            <p>Categorias para encontrar trabajadores mas rapido.</p>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{meta.page}/{meta.totalPages}</span>
                            <p>Navegacion paginada desde el backend para mejor rendimiento.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="section-head">
                    <div>
                        <h2 className="section-title">Servicios destacados</h2>
                        <p className="section-copy">
                            Explora ofertas por categoria, rango de precio y especialidad.
                        </p>
                    </div>
                    <p className="section-copy">{meta.total} resultados encontrados</p>
                </div>

                <div className="filter-row">
                    {categoriasVisibles.map((categoria) => (
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
                {!cargando && !error && servicios.length === 0 && (
                    <div className="surface-card empty-state">
                        No encontramos servicios para esa busqueda. Intenta otros filtros.
                    </div>
                )}

                {!cargando && !error && servicios.length > 0 && (
                    <>
                        <div className="cards-grid">
                            {servicios.map((servicio) => (
                                <ServiceCard
                                    key={servicio._id}
                                    servicio={servicio}
                                    accion={() => contactarServicio(servicio)}
                                    accionLabel="Contactar"
                                />
                            ))}
                        </div>

                        <div
                            style={{
                                marginTop: '1.5rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.75rem',
                            }}
                        >
                            <button
                                type="button"
                                className="button-ghost"
                                disabled={!meta.hasPrevPage}
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            >
                                Anterior
                            </button>

                            <span className="section-copy">
                                Pagina {meta.page} de {meta.totalPages}
                            </span>

                            <button
                                type="button"
                                className="button"
                                disabled={!meta.hasNextPage}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Siguiente
                            </button>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};

export default HomePage;
