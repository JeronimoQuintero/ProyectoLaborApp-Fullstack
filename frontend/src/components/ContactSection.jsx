const ContactSection = ({ correo, telefono, onTelefonoChange }) => {
    return (
        <section className="surface-card contact-panel">
            <div className="contact-panel__header">
                <span className="eyebrow contact-panel__eyebrow">Contacto</span>
                <h3 className="contact-panel__title">Informacion de contacto</h3>
                <p className="contact-panel__copy">
                    Estos datos se compartiran con el cliente cuando pulse el boton de contacto.
                </p>
            </div>

            <div className="contact-panel__grid">
                <div className="field-group">
                    <label className="field-label" htmlFor="registro-correo-contacto">
                        Correo de contacto
                    </label>
                    <input
                        id="registro-correo-contacto"
                        className="input"
                        value={correo}
                        readOnly
                    />
                </div>

                <div className="field-group">
                    <label className="field-label" htmlFor="registro-telefono">
                        Celular de contacto
                    </label>
                    <input
                        id="registro-telefono"
                        className="input"
                        name="telefono"
                        value={telefono}
                        onChange={onTelefonoChange}
                        placeholder="3001234567"
                        required
                    />
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
