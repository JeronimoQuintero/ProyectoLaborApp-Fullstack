import { useEffect, useMemo, useState } from 'react';
import API from '../api/api.js';
import ServiceCard from '../components/ServiceCard.jsx';
import { categoriasOficio, formatearCategoriaOficio } from '../data/oficios.js';
import oficioPlomeriaImg from '../assets/oficio-plomeria.jpg';
import oficioElectricidadImg from '../assets/oficio-electricidad.jpg';
import oficioTecnologiaImg from '../assets/oficio-tecnologia.jpg';
import buscadorOficiosImg from '../assets/buscador-oficios.jpg';

const HomePage = () => {
    const [servicios, setServicios] = useState([]);
    const [busquedaInput, setBusquedaInput] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
    const [minPrecio, setMinPrecio] = useState('');
    const [maxPrecio, setMaxPrecio] = useState('');
    const [orden, setOrden] = useState('createdAt-desc');
    const [page, setPage] = useState(1);
    const [oficioActivo, setOficioActivo] = useState(0);
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
            setError('Este trabajador aún no tiene correo ni celular disponibles para contacto.');
        }
    };

    const categoriasVisibles = useMemo(() => ['Todas', ...categoriasOficio], []);
    const oficiosDestacados = useMemo(
        () => [
            {
                id: 'plomeria',
                titulo: 'Plomería y reparaciones',
                descripcion:
                    'Trabajadores especializados en fugas, grifería, tuberías y mantenimiento del hogar.',
                imagen: oficioPlomeriaImg,
                alt: 'Plomero trabajando en reparación de un calentador',
                etiqueta: 'Hogar',
            },
            {
                id: 'electricidad',
                titulo: 'Electricidad y mantenimiento',
                descripcion:
                    'Técnicos para instalaciones eléctricas, paneles y solución de fallas con protocolos de seguridad.',
                imagen: oficioElectricidadImg,
                alt: 'Electricista trabajando en panel eléctrico',
                etiqueta: 'Mantenimiento',
            },
            {
                id: 'tecnologia',
                titulo: 'Soporte técnico digital',
                descripcion:
                    'Profesionales que diagnostican equipos y realizan soporte especializado en hardware y tecnología.',
                imagen: oficioTecnologiaImg,
                alt: 'Técnico reparando un computador en mesa de trabajo',
                etiqueta: 'Tecnología',
            },
        ],
        []
    );
    const oficioActual = oficiosDestacados[oficioActivo];

    useEffect(() => {
        const intervalo = setInterval(() => {
            setOficioActivo((actual) => (actual + 1) % oficiosDestacados.length);
        }, 5200);

        return () => clearInterval(intervalo);
    }, [oficiosDestacados.length]);

    const irAOficioAnterior = () => {
        setOficioActivo((actual) => (actual - 1 + oficiosDestacados.length) % oficiosDestacados.length);
    };

    const irAOficioSiguiente = () => {
        setOficioActivo((actual) => (actual + 1) % oficiosDestacados.length);
    };

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
                            <div className="search-card__visual-wrap">
                                <img
                                    className="search-card__visual"
                                    src={buscadorOficiosImg}
                                    alt="Trabajador realizando mantenimiento técnico"
                                />
                                <div className="search-card__badge">Explora oficios reales en acción</div>
                            </div>

                            <input
                                className="search-field"
                                type="text"
                                placeholder="Busca por oficio, título o categoría"
                                value={busquedaInput}
                                onChange={(event) => setBusquedaInput(event.target.value)}
                            />

                            <div className="search-card__filters">
                                <input
                                    className="input"
                                    type="number"
                                    min="0"
                                    placeholder="Precio mínimo"
                                    value={minPrecio}
                                    onChange={(event) => setMinPrecio(event.target.value)}
                                />
                                <input
                                    className="input"
                                    type="number"
                                    min="0"
                                    placeholder="Precio máximo"
                                    value={maxPrecio}
                                    onChange={(event) => setMaxPrecio(event.target.value)}
                                />
                                <select
                                    className="select"
                                    value={orden}
                                    onChange={(event) => setOrden(event.target.value)}
                                >
                                    <option value="createdAt-desc">Más recientes</option>
                                    <option value="precio-asc">Precio menor a mayor</option>
                                    <option value="precio-desc">Precio mayor a menor</option>
                                    <option value="titulo-asc">Título A-Z</option>
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
                            <p>Categorías para encontrar trabajadores más rápido.</p>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{meta.page}/{meta.totalPages}</span>
                            <p>Navega entre ofertas.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="evidence-section">
                <div className="section-head">
                    <div>
                        <h2 className="section-title">Oficios que encuentras en LaborApp</h2>
                        <p className="section-copy">
                            Imágenes reales de los tipos de trabajo que puedes contratar dentro de la plataforma.
                        </p>
                    </div>
                    <div className="carousel-controls" aria-label="Controles del carrusel">
                        <button type="button" className="icon-button" onClick={irAOficioAnterior} aria-label="Ver oficio anterior">
                            ‹
                        </button>
                        <button type="button" className="icon-button" onClick={irAOficioSiguiente} aria-label="Ver oficio siguiente">
                            ›
                        </button>
                    </div>
                </div>

                <div className="carousel-shell">
                    <article className="carousel-feature">
                        <img
                            className="carousel-feature__image"
                            src={oficioActual.imagen}
                            alt={oficioActual.alt}
                        />
                        <div className="carousel-feature__content">
                            <span className="carousel-feature__tag">{oficioActual.etiqueta}</span>
                            <h3>{oficioActual.titulo}</h3>
                            <p>{oficioActual.descripcion}</p>
                        </div>
                    </article>

                    <div className="carousel-track" aria-label="Oficios destacados">
                        {oficiosDestacados.map((oficio, index) => (
                            <button
                                key={oficio.id}
                                type="button"
                                className={index === oficioActivo ? 'carousel-thumb carousel-thumb--active' : 'carousel-thumb'}
                                onClick={() => setOficioActivo(index)}
                                aria-label={`Ver ${oficio.titulo}`}
                            >
                                <img
                                    className="carousel-thumb__image"
                                    src={oficio.imagen}
                                    alt={oficio.alt}
                                    loading="lazy"
                                />
                                <span>{oficio.titulo}</span>
                            </button>
                        ))}
                    </div>

                    <div className="carousel-dots" aria-label="Indicadores del carrusel">
                        {oficiosDestacados.map((oficio, index) => (
                            <button
                                key={oficio.id}
                                type="button"
                                className={index === oficioActivo ? 'carousel-dot carousel-dot--active' : 'carousel-dot'}
                                onClick={() => setOficioActivo(index)}
                                aria-label={`Ir a ${oficio.titulo}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section>
                <div className="section-head">
                    <div>
                        <h2 className="section-title">Servicios destacados</h2>
                        <p className="section-copy">
                            Explora ofertas por categoría, rango de precio y especialidad.
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
                            {formatearCategoriaOficio(categoria)}
                        </button>
                    ))}
                </div>

                {cargando && <div className="surface-card empty-state">Cargando servicios...</div>}
                {!cargando && error && <div className="feedback">{error}</div>}
                {!cargando && !error && servicios.length === 0 && (
                    <div className="surface-card empty-state">
                        No encontramos servicios para esa búsqueda. Intenta otros filtros.
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
                                Página {meta.page} de {meta.totalPages}
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
