export const catalogoOficios = {
    Hogar: ['Plomeria', 'Carpinteria', 'Electricidad', 'Pintura', 'Jardineria', 'Aseo'],
    Tecnologia: ['Soporte tecnico', 'Desarrollo web', 'Diseno grafico', 'Redes', 'Mantenimiento PC'],
    Enseñanza: ['Matematicas', 'Idiomas', 'Musica', 'Programacion', 'Refuerzo escolar'],
    Belleza: ['Barberia', 'Maquillaje', 'Manicure', 'Masajes', 'Estetica'],
    Transporte: ['Mensajeria', 'Mudanzas', 'Conductor', 'Delivery'],
    Otros: ['Asistente general', 'Fotografia', 'Eventos', 'Cuidador', 'Otro oficio'],
};

const etiquetasCategoria = {
    Tecnologia: 'Tecnología',
};

const etiquetasOficio = {
    Plomeria: 'Plomería',
    Carpinteria: 'Carpintería',
    Jardineria: 'Jardinería',
    'Soporte tecnico': 'Soporte técnico',
    'Diseno grafico': 'Diseño gráfico',
    Matematicas: 'Matemáticas',
    Musica: 'Música',
    Programacion: 'Programación',
    Barberia: 'Barbería',
    Estetica: 'Estética',
    Mensajeria: 'Mensajería',
    Fotografia: 'Fotografía',
};

export const categoriasOficio = Object.keys(catalogoOficios);

export const obtenerOficiosPorCategoria = (categoria) => catalogoOficios[categoria] || catalogoOficios.Otros;

export const formatearCategoriaOficio = (categoria = '') => etiquetasCategoria[categoria] || categoria;

export const formatearOficio = (oficio = '') => etiquetasOficio[oficio] || oficio;
