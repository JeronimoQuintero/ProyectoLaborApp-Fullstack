// Obtener servicios del usuario logueado
router.get('/mis-servicios', auth, async (req, res) => {
    try {
        const servicios = await Servicio.find({ usuario: req.usuario.id });
        res.json(servicios);
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

// Eliminar un servicio
router.delete('/:id', auth, async (req, res) => {
    try {
        const servicio = await Servicio.findById(req.params.id);
        if (!servicio) return res.status(404).json({ mensaje: 'No encontrado' });
        
        // Verificar que el dueño sea quien borra
        if (servicio.usuario.toString() !== req.usuario.id) {
            return res.status(401).json({ mensaje: 'No autorizado' });
        }

        await servicio.deleteOne();
        res.json({ mensaje: 'Servicio eliminado' });
    } catch (error) {
        res.status(500).send('Error al eliminar');
    }
});