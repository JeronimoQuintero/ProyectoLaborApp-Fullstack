import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import ServiceCard from '../components/ServiceCard.jsx';

const MisServiciosPage = () => {
    const navigate = useNavigate();
    const [servicios, setServicios] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        let activo = true;

        const cargarMisServicios = async () => {
            try {
                setError('');
                const res = await API.get('/servicios/mis-servicios');

                if (activo) {
                    setServicios(res.data);
                }
            } catch {
                if (activo) {
                    setError('No fue posible cargar tus publicaciones.');
                }
            }
        };

        cargarMisServicios();

        return () => {
            activo = false;
        };
    }, []);

    const eliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta publicación?')) {
            return;
        }

        try {
            await API.delete(`/servicios/${id}`);
            setServicios((prevServicios) => prevServicios.filter((servicio) => servicio._id !== id));
        } catch {
            alert('No se pudo eliminar el servicio.');
        }
    };

    return (
        <section>
            <div className="section-head">
                <div>
                    <h2 className="section-title">Mis publicaciones</h2>
                    <p className="section-copy">
                        Revisa, organiza y elimina tus servicios desde un panel más limpio y profesional.
                    </p>
                </div>
                <p className="section-copy">{servicios.length} servicios activos</p>
            </div>

            {error && <div className="feedback">{error}</div>}

            {servicios.length === 0 ? (
                <div className="surface-card empty-state">Todavía no has publicado ningún servicio.</div>
            ) : (
                <div className="cards-grid">
                    {servicios.map((servicio) => (
                        <ServiceCard
                            key={servicio._id}
                            servicio={servicio}
                            secondaryAction={() => navigate(`/editar-servicio/${servicio._id}`)}
                            secondaryActionLabel="Editar"
                            accion={() => eliminar(servicio._id)}
                            accionLabel="Eliminar"
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default MisServiciosPage;
