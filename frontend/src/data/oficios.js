export const catalogoOficios = {
    Hogar: ['Plomeria', 'Carpinteria', 'Electricidad', 'Pintura', 'Jardineria', 'Aseo'],
    Tecnologia: ['Soporte tecnico', 'Desarrollo web', 'Diseno grafico', 'Redes', 'Mantenimiento PC'],
    Ensenanza: ['Matematicas', 'Idiomas', 'Musica', 'Programacion', 'Refuerzo escolar'],
    Belleza: ['Barberia', 'Maquillaje', 'Manicure', 'Masajes', 'Estetica'],
    Transporte: ['Mensajeria', 'Mudanzas', 'Conductor', 'Delivery'],
    Otros: ['Asistente general', 'Fotografia', 'Eventos', 'Cuidador', 'Otro oficio'],
};

export const categoriasOficio = Object.keys(catalogoOficios);

export const obtenerOficiosPorCategoria = (categoria) => catalogoOficios[categoria] || catalogoOficios.Otros;
