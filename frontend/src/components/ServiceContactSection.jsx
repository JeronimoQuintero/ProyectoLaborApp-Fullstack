const ServiceContactSection = ({ correoContacto, telefonoContacto, onChange }) => {
    return (
        <section className="surface-card contact-panel">
            <div className="contact-panel__header">
                <span className="eyebrow contact-panel__eyebrow">Servicio</span>
                <h3 className="contact-panel__title">Contacto del servicio</h3>
                <p className="contact-panel__copy">
                    Estos datos se mostraran en este servicio cuando el cliente pulse el boton de contacto.
                </p>
            </div>

            <div className="contact-panel__grid">
                <div className="field-group">
                    <label className="field-label" htmlFor="servicio-correo-contacto">
                        Correo de contacto
                    </label>
                    <input
                        id="servicio-correo-contacto"
                        className="input"
                        name="correoContacto"
                        value={correoContacto}
                        onChange={onChange}
                        placeholder="tu@correo.com"
                        required
                    />
                </div>

                <div className="field-group">
                    <label className="field-label" htmlFor="servicio-telefono-contacto">
                        Celular de contacto
                    </label>
                    <input
                        id="servicio-telefono-contacto"
                        className="input"
                        name="telefonoContacto"
                        value={telefonoContacto}
                        onChange={onChange}
                        placeholder="3001234567"
                        required
                    />
                </div>
            </div>
        </section>
    );
};

export default ServiceContactSection;
