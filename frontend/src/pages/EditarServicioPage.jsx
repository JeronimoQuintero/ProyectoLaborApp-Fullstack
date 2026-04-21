import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/api.js';
import { categoriasOficio, obtenerOficiosPorCategoria } from '../data/oficios.js';
import ServiceContactSection from '../components/ServiceContactSection.jsx';

const EditarServicioPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        titulo: '',
        descripcion: '',
        precio: '',
        categoria: 'Hogar',
        oficio: '',
        correoContacto: '',
        telefonoContacto: '',
    });
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const cargarServicio = async () => {
            try {
                setError('');
                const res = await API.get(`/servicios/mis-servicios/${id}`);
                setForm({
                    titulo: res.data.titulo || '',
                    descripcion: res.data.descripcion || '',
                    precio: res.data.precio || '',
                    categoria: res.data.categoria || 'Hogar',
                    oficio: res.data.oficio || '',
                    correoContacto: res.data.correoContacto || '',
                    telefonoContacto: res.data.telefonoContacto || '',
                });
            } catch (err) {
                setError(err.response?.data?.mensaje || 'No fue posible cargar el servicio.');
            } finally {
                setCargando(false);
            }
        };

        cargarServicio();
    }, [id]);

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMensaje('');

        try {
            await API.put(`/servicios/${id}`, form);
            setMensaje('Servicio actualizado con exito.');
            setTimeout(() => navigate('/mis-servicios'), 900);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo actualizar el servicio.');
        }
    };

    if (cargando) {
        return <div className="surface-card empty-state">Cargando servicio...</div>;
    }

    return (
        <section className="form-page">
            <aside className="surface-card promo-panel">
                <span className="eyebrow">Edicion inteligente</span>
                <h1>Actualiza tu servicio sin perder la presencia profesional del anuncio.</h1>
                <p>
                    Mejora tu descripcion, ajusta el precio o cambia la categoria para mantener tu oferta
                    actualizada y mas competitiva.
                </p>

                <div className="promo-panel__list">
                    <div className="promo-point">Ajusta el contenido sin crear una publicacion nueva.</div>
                    <div className="promo-point">Refina precio y categoria segun tu estrategia.</div>
                    <div className="promo-point">Regresa al panel apenas termines de guardar.</div>
                </div>
            </aside>

            <div className="surface-card form-card">
                <h2>Editar servicio</h2>
                <p>Modifica la informacion de tu publicacion y guarda los cambios.</p>

                <form className="form-layout" onSubmit={handleSubmit}>
                    <div className="field-group">
                        <label className="field-label" htmlFor="editar-titulo">Titulo</label>
                        <input
                            id="editar-titulo"
                            className="input"
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="editar-descripcion">Descripcion</label>
                        <textarea
                            id="editar-descripcion"
                            className="textarea"
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="editar-precio">Precio</label>
                        <input
                            id="editar-precio"
                            className="input"
                            name="precio"
                            type="number"
                            value={form.precio}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="editar-categoria">Categoria</label>
                        <select
                            id="editar-categoria"
                            className="select"
                            name="categoria"
                            value={form.categoria}
                            onChange={(event) =>
                                setForm({ ...form, categoria: event.target.value, oficio: '' })
                            }
                        >
                            {categoriasOficio.map((categoria) => (
                                <option key={categoria} value={categoria}>{categoria}</option>
                            ))}
                        </select>
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="editar-oficio">Oficio</label>
                        <select
                            id="editar-oficio"
                            className="select"
                            name="oficio"
                            value={form.oficio}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona un oficio</option>
                            {obtenerOficiosPorCategoria(form.categoria).map((oficio) => (
                                <option key={oficio} value={oficio}>{oficio}</option>
                            ))}
                        </select>
                    </div>

                    <ServiceContactSection
                        correoContacto={form.correoContacto}
                        telefonoContacto={form.telefonoContacto}
                        onChange={handleChange}
                    />

                    <button className="button" type="submit">Guardar cambios</button>
                </form>

                {mensaje && <div className="inline-note">{mensaje}</div>}
                {error && <div className="feedback">{error}</div>}
            </div>
        </section>
    );
};

export default EditarServicioPage;
