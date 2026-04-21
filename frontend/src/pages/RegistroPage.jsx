import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api.js';
import { categoriasOficio, obtenerOficiosPorCategoria } from '../data/oficios.js';
import ContactSection from '../components/ContactSection.jsx';

const RegistroPage = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        password: '',
        rol: 'cliente',
        telefono: '',
        oficioCategoria: 'Hogar',
        oficio: '',
    });
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMensaje('');

        try {
            await API.post('/usuarios/registro', formData);
            setMensaje('Registro exitoso. Ahora puedes iniciar sesion.');
            setTimeout(() => navigate('/login'), 900);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No fue posible completar el registro.');
        }
    };

    return (
        <section className="form-page">
            <aside className="surface-card promo-panel">
                <span className="eyebrow">Crea tu perfil</span>
                <h1>Empieza con una presencia más profesional desde el primer contacto.</h1>
                <p>
                    Registra clientes y trabajadores en una experiencia clara, ordenada y lista para crecer
                    con tu proyecto de grado.
                </p>

                <div className="promo-panel__list">
                    <div className="promo-point">Perfil simple para clientes que buscan ayuda rapida.</div>
                    <div className="promo-point">Perfil de trabajador con especialidad visible.</div>
                    <div className="promo-point">Base perfecta para sumar reputacion y mensajeria despues.</div>
                </div>
            </aside>

            <div className="surface-card form-card">
                <h2>Crear cuenta</h2>
                <p>Completa tus datos y elige si vas a contratar o a ofrecer servicios.</p>

                <form className="form-layout" onSubmit={handleSubmit}>
                    <div className="field-group">
                        <label className="field-label" htmlFor="registro-nombre">Nombre completo</label>
                        <input
                            id="registro-nombre"
                            className="input"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Tu nombre"
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="registro-correo">Correo electronico</label>
                        <input
                            id="registro-correo"
                            className="input"
                            name="correo"
                            type="email"
                            value={formData.correo}
                            onChange={handleChange}
                            placeholder="tu@correo.com"
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="registro-password">Contrasena</label>
                        <input
                            id="registro-password"
                            className="input"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimo 6 caracteres"
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="registro-rol">Tipo de usuario</label>
                        <select
                            id="registro-rol"
                            className="select"
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                        >
                            <option value="cliente">Cliente</option>
                            <option value="trabajador">Trabajador</option>
                        </select>
                    </div>

                    {formData.rol === 'trabajador' && (
                        <>
                            <ContactSection
                                correo={formData.correo}
                                telefono={formData.telefono}
                                onTelefonoChange={handleChange}
                            />

                            <div className="field-group">
                                <label className="field-label" htmlFor="registro-oficio-categoria">Categoria del oficio</label>
                                <select
                                    id="registro-oficio-categoria"
                                    className="select"
                                    name="oficioCategoria"
                                    value={formData.oficioCategoria}
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            oficioCategoria: event.target.value,
                                            oficio: '',
                                        })
                                    }
                                >
                                    {categoriasOficio.map((categoria) => (
                                        <option key={categoria} value={categoria}>{categoria}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="field-group">
                                <label className="field-label" htmlFor="registro-oficio">Oficio o especialidad</label>
                                <select
                                    id="registro-oficio"
                                    className="select"
                                    name="oficio"
                                    value={formData.oficio}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona un oficio</option>
                                    {obtenerOficiosPorCategoria(formData.oficioCategoria).map((oficio) => (
                                        <option key={oficio} value={oficio}>{oficio}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <button className="button" type="submit">Crear mi cuenta</button>
                </form>

                {mensaje && <div className="inline-note">{mensaje}</div>}
                {error && <div className="feedback">{error}</div>}
            </div>
        </section>
    );
};

export default RegistroPage;
