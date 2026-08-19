const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const createId = () => randomUUID();
const nowIso = () => new Date().toISOString();
const normalizeEmail = (value = '') => String(value).trim().toLowerCase();

const state = {
    initialized: false,
    users: [],
    services: [],
};

const useInMemoryStore = () => process.env.USE_IN_MEMORY_DB === 'true';

const ensureInitialized = () => {
    if (state.initialized) {
        return state;
    }

    const now = nowIso();
    const workerId = createId();
    const clientId = createId();

    state.users = [
        {
            _id: workerId,
            nombre: 'Daniela Rojas',
            correo: 'trabajador@laborapp.demo',
            password: bcrypt.hashSync('DemoPass123', 10),
            rol: 'trabajador',
            telefono: '+57 301 456 8899',
            oficioCategoria: 'Hogar',
            oficio: 'Plomeria',
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: clientId,
            nombre: 'Carlos Perez',
            correo: 'cliente@laborapp.demo',
            password: bcrypt.hashSync('DemoPass123', 10),
            rol: 'cliente',
            telefono: '',
            oficioCategoria: 'General',
            oficio: 'Ninguno',
            createdAt: now,
            updatedAt: now,
        },
    ];

    state.services = [
        {
            _id: createId(),
            titulo: 'Reparacion de fugas en cocina y banos',
            descripcion: 'Diagnostico rapido, cambio de piezas y pruebas para asegurar que no vuelva la fuga.',
            precio: 85000,
            categoria: 'Hogar',
            oficioCategoria: 'Hogar',
            oficio: 'Plomeria',
            correoContacto: 'trabajador@laborapp.demo',
            telefonoContacto: '+57 301 456 8899',
            usuario: workerId,
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: createId(),
            titulo: 'Instalacion de tomas y luminarias LED',
            descripcion: 'Servicio de electricidad residencial con materiales certificados y trabajo limpio.',
            precio: 95000,
            categoria: 'Hogar',
            oficioCategoria: 'Hogar',
            oficio: 'Electricidad',
            correoContacto: 'trabajador@laborapp.demo',
            telefonoContacto: '+57 301 456 8899',
            usuario: workerId,
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: createId(),
            titulo: 'Mantenimiento y optimizacion de computador',
            descripcion: 'Limpieza fisica, respaldo basico y mejora de rendimiento para equipos lentos.',
            precio: 120000,
            categoria: 'Tecnologia',
            oficioCategoria: 'Tecnologia',
            oficio: 'Mantenimiento PC',
            correoContacto: 'trabajador@laborapp.demo',
            telefonoContacto: '+57 301 456 8899',
            usuario: workerId,
            createdAt: now,
            updatedAt: now,
        },
    ];

    state.initialized = true;
    return state;
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const store = {
    findUserByEmail(correo) {
        const db = ensureInitialized();
        const normalized = normalizeEmail(correo);
        return db.users.find((user) => normalizeEmail(user.correo) === normalized) || null;
    },

    findUserById(id) {
        const db = ensureInitialized();
        return db.users.find((user) => String(user._id) === String(id)) || null;
    },

    createUser(payload) {
        const db = ensureInitialized();
        const now = nowIso();

        const user = {
            _id: createId(),
            nombre: payload.nombre,
            correo: normalizeEmail(payload.correo),
            password: payload.password,
            rol: payload.rol,
            telefono: payload.telefono || '',
            oficioCategoria: payload.oficioCategoria || 'General',
            oficio: payload.oficio || 'Ninguno',
            createdAt: now,
            updatedAt: now,
        };

        db.users.push(user);
        return clone(user);
    },

    listServices() {
        const db = ensureInitialized();
        return clone(db.services);
    },

    findServiceById(id) {
        const db = ensureInitialized();
        return db.services.find((service) => String(service._id) === String(id)) || null;
    },

    createService(payload) {
        const db = ensureInitialized();
        const now = nowIso();

        const service = {
            _id: createId(),
            titulo: payload.titulo,
            descripcion: payload.descripcion,
            precio: payload.precio,
            categoria: payload.categoria,
            oficioCategoria: payload.oficioCategoria || 'General',
            oficio: payload.oficio,
            correoContacto: normalizeEmail(payload.correoContacto),
            telefonoContacto: payload.telefonoContacto,
            usuario: String(payload.usuario),
            createdAt: now,
            updatedAt: now,
        };

        db.services.push(service);
        return clone(service);
    },

    updateService(id, updates) {
        const db = ensureInitialized();
        const current = db.services.find((service) => String(service._id) === String(id));

        if (!current) {
            return null;
        }

        Object.assign(current, updates, { updatedAt: nowIso() });
        return clone(current);
    },

    removeService(id) {
        const db = ensureInitialized();
        const index = db.services.findIndex((service) => String(service._id) === String(id));
        if (index < 0) {
            return false;
        }
        db.services.splice(index, 1);
        return true;
    },

    listServicesByUser(userId) {
        const db = ensureInitialized();
        return clone(
            db.services.filter((service) => String(service.usuario) === String(userId))
        );
    },
};

module.exports = {
    useInMemoryStore,
    store,
};
