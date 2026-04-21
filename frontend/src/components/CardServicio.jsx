const cardStyle = {
    background: '#ffffff',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '1px solid #f1f5f9',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
};

const CardServicio = ({ servicio, accion, accionLabel = 'Contactar' }) => {
    return (
        <article style={cardStyle}>
            <div style={{ padding: '30px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <span
                        style={{
                            background: '#ecfdf5',
                            color: '#059669',
                            padding: '6px 16px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                        }}
                    >
                        {servicio.categoria}
                    </span>
                </div>

                <h3
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#1e293b',
                        marginBottom: '12px',
                    }}
                >
                    {servicio.titulo}
                </h3>

                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '1rem' }}>
                    {servicio.descripcion}
                </p>
            </div>

            <div
                style={{
                    padding: '25px 30px',
                    background: '#f8fafc',
                    borderTop: '1px solid #f1f5f9',
                    marginTop: 'auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                }}
            >
                <div>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                        ${Number(servicio.precio || 0).toLocaleString()}
                    </span>
                    {servicio.usuario?.nombre && (
                        <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                            {servicio.usuario.nombre}
                            {servicio.usuario.oficio ? ` · ${servicio.usuario.oficio}` : ''}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={accion}
                    disabled={!accion}
                    style={{
                        background: accion ? '#0f172a' : '#cbd5e1',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '14px',
                        fontWeight: '700',
                        cursor: accion ? 'pointer' : 'not-allowed',
                        fontSize: '0.9rem',
                    }}
                >
                    {accionLabel}
                </button>
            </div>
        </article>
    );
};

export default CardServicio;
