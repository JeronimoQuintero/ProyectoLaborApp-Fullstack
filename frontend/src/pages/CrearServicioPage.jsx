import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api.js';
import { categoriasOficio, obtenerOficiosPorCategoria } from '../data/oficios.js';
import ServiceContactSection from '../components/ServiceContactSection.jsx';

const CrearServicioPage = () => {
    const [form, setForm] = useState({
        titulo: '',
        descripcion: '',
        precio: '',
        categoria: 'Hogar',
        oficio: '',
        correoContacto: '',
        telefonoContacto: '',
    });
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMensaje('');

        try {
            await API.post('/servicios', form);
            setMensaje('Servicio publicado con exito.');
            setTimeout(() => navigate('/mis-servicios'), 900);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo publicar el servicio.');
        }
    };

    return (
        <section className="form-page">
            <aside className="surface-card promo-panel">
                <span className="eyebrow">Publicacion profesional</span>
                <h1>Convierte tu experiencia en una oferta clara, atractiva y confiable.</h1>
                <p>
                    Describe bien tu servicio, muestra tu categoria y define un precio visible para que el
                    cliente entienda tu propuesta desde el primer vistazo.
                </p>

                <div className="promo-panel__list">
                    <div className="promo-point">Titulos claros para mejorar la primera impresion.</div>
                    <div className="promo-point">Descripcion detallada para transmitir confianza.</div>
                    <div className="promo-point">Precio visible para reducir friccion al contactar.</div>
                </div>
            </aside>

            <div className="surface-card form-card">
                <h2>Publicar servicio</h2>
                <p>Completa los campos y agrega tu oferta al directorio principal.</p>

                <form className="form-layout" onSubmit={handleSubmit}>
                    <div className="field-group">
                        <label className="field-label" htmlFor="servicio-titulo">Titulo</label>
                        <input
                            id="servicio-titulo"
                            className="input"
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            placeholder="Ejemplo: Reparacion de computadores a domicilio"
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="servicio-descripcion">Descripcion</label>
                        <textarea
                            id="servicio-descripcion"
                            className="textarea"
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            placeholder="Cuenta que haces, como trabajas y que te diferencia."
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="servicio-precio">Precio sugerido</label>
                        <input
                            id="servicio-precio"
                            className="input"
                            name="precio"
                            type="number"
                            value={form.precio}
                            onChange={handleChange}
                            placeholder="50000"
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="servicio-categoria">Categoria</label>
                        <select
                            id="servicio-categoria"
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
                        <label className="field-label" htmlFor="servicio-oficio">Oficio</label>
                        <select
                            id="servicio-oficio"
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

                    <button className="button" type="submit">Publicar ahora</button>
                </form>

                {mensaje && <div className="inline-note">{mensaje}</div>}
                {error && <div className="feedback">{error}</div>}
            </div>
        </section>
    );
};

export default CrearServicioPage;
