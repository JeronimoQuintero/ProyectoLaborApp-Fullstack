import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import ServiceCard from '../components/ServiceCard.jsx';

const MisServiciosPage = () => {
    const navigate = useNavigate();
    const [servicios, setServicios] = useState([]);
    const [error, setError] = useState('');

    const cargarMisServicios = async () => {
        try {
            setError('');
            const res = await API.get('/servicios/mis-servicios');
            setServicios(res.data);
        } catch (error) {
            setError('No fue posible cargar tus publicaciones.');
        }
    };

    useEffect(() => {
        cargarMisServicios();
    }, []);

    const eliminar = async (id) => {
        if (!window.confirm('Estas seguro de eliminar esta publicacion?')) {
            return;
        }

        try {
            await API.delete(`/servicios/${id}`);
            cargarMisServicios();
        } catch (error) {
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
                <div className="surface-card empty-state">Todavia no has publicado ningun servicio.</div>
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
