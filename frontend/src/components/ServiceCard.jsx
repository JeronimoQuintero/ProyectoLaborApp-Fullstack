import { useState } from 'react';

const ServiceCard = ({
    servicio,
    accion,
    accionLabel = 'Contactar',
    secondaryAction,
    secondaryActionLabel = 'Editar',
}) => {
    const [mostrarContacto, setMostrarContacto] = useState(false);
    const correoDisponible = servicio.correoContacto || servicio.usuario?.correo || '';
    const telefonoDisponible = servicio.telefonoContacto || servicio.usuario?.telefono || '';
    const telefonoLimpio = telefonoDisponible.replace(/[^\d+]/g, '');

    return (
        <article className="surface-card service-card">
            <div className="service-card__body">
                <span className="service-card__category">{servicio.categoria}</span>
                <h3 className="service-card__title">{servicio.titulo}</h3>
                <p className="service-card__description">{servicio.descripcion}</p>
                <p className="service-card__meta">
                    Oficio: {servicio.oficio || servicio.usuario?.oficio || 'General'}
                </p>
            </div>

            <div className="service-card__footer">
                <div>
                    <span className="service-card__price">
                        ${Number(servicio.precio || 0).toLocaleString()}
                    </span>
                    {servicio.usuario?.nombre && (
                        <p className="service-card__meta">
                            {servicio.usuario.nombre}
                            {servicio.usuario.oficio ? ` · ${servicio.usuario.oficio}` : ''}
                        </p>
                    )}
                </div>

                <div className="service-card__actions">
                    {secondaryAction && (
                        <button
                            type="button"
                            onClick={secondaryAction}
                            className="button-ghost"
                        >
                            {secondaryActionLabel}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setMostrarContacto((prev) => !prev)}
                        className="button"
                    >
                        {mostrarContacto ? 'Ocultar contacto' : accionLabel}
                    </button>
                </div>
            </div>

            {mostrarContacto && (
                <div className="service-card__contact">
                    <p className="service-card__contact-title">Contacto del trabajador</p>
                    <div className="service-card__contact-links">
                        <a
                            className="button"
                            href={correoDisponible ? `mailto:${correoDisponible}` : undefined}
                            onClick={(event) => {
                                if (!correoDisponible && accion) {
                                    event.preventDefault();
                                    accion();
                                }
                            }}
                        >
                            Correo
                        </a>
                        <a
                            className="button-ghost"
                            href={telefonoLimpio ? `tel:${telefonoLimpio}` : undefined}
                            onClick={(event) => {
                                if (!telefonoLimpio && accion) {
                                    event.preventDefault();
                                    accion();
                                }
                            }}
                        >
                            Celular
                        </a>
                    </div>
                    <div className="service-card__contact-meta">
                        <span>{correoDisponible || 'Correo no disponible'}</span>
                        <span>{telefonoDisponible || 'Celular no disponible'}</span>
                    </div>
                </div>
            )}
        </article>
    );
};

export default ServiceCard;
