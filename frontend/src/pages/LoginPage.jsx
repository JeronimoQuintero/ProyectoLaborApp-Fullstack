import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext.jsx';
import API from '../api/api.js';

const LoginPage = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const res = await API.post('/usuarios/login', { correo, password });
            login(res.data.usuario, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No fue posible iniciar sesion.');
        }
    };

    return (
        <section className="form-page">
            <aside className="surface-card promo-panel">
                <span className="eyebrow">Acceso seguro</span>
                <h1>Vuelve a tu panel y administra tus servicios con estilo.</h1>
                <p>
                    Inicia sesion para publicar, revisar tus ofertas y mantener tu perfil profesional
                    visible para nuevos clientes.
                </p>

                <div className="promo-panel__list">
                    <div className="promo-point">Gestiona publicaciones desde un mismo panel.</div>
                    <div className="promo-point">Mantén tu sesion y navega entre rutas protegidas.</div>
                    <div className="promo-point">Conecta el frontend con tu API sin pasos extra.</div>
                </div>
            </aside>

            <div className="surface-card form-card">
                <h2>Iniciar sesion</h2>
                <p>Ingresa tus datos para entrar a tu cuenta.</p>

                <form className="form-layout" onSubmit={handleSubmit}>
                    <div className="field-group">
                        <label className="field-label" htmlFor="login-correo">Correo electronico</label>
                        <input
                            id="login-correo"
                            className="input"
                            type="email"
                            value={correo}
                            onChange={(event) => setCorreo(event.target.value)}
                            placeholder="tu@correo.com"
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="login-password">Contrasena</label>
                        <input
                            id="login-password"
                            className="input"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Minimo 6 caracteres"
                            required
                        />
                    </div>

                    <button className="button" type="submit">Entrar a LaborApp</button>
                </form>

                {error && <div className="feedback">{error}</div>}
            </div>
        </section>
    );
};

export default LoginPage;
