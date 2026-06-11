import { Rating, Image, Post } from '../models/sync/sync.js';
import { validarValoracion, obtenerError } from '../middleware/validates.js';

export async function rate(req, res) {
    const { value, imageId, postId } = req.body;
    const userId = req.session.user.id;

    // Validación con Zod
    const resultado = validarValoracion({ value, imageId, postId });
    if (!resultado.success) {
        return res.status(400).json({ error: obtenerError(resultado) });
    }

    try {
        const image = await Image.findByPk(imageId, {
            include: [{ model: Post }]
        });

        if (!image) return res.status(404).json({ error: 'Imagen no encontrada' });

        if (image.Post.user_id === userId) {
            return res.status(403).json({ error: 'No podés valorar tu propia imagen' });
        }

        const existing = await Rating.findOne({
            where: { user_id: userId, image_id: imageId }
        });

        if (existing) return res.status(409).json({ error: 'Ya valoraste esta imagen' });

        await Rating.create({
            value: parseInt(value),
            user_id: userId,
            image_id: imageId
        });

        const allRatings = await Rating.findAll({ where: { image_id: imageId } });
        const total = allRatings.length;
        const suma = allRatings.reduce((acc, r) => acc + r.value, 0);
        const promedio = parseFloat((suma / total).toFixed(1));

        res.status(200).json({ ok: true, value: parseInt(value), promedio, total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al valorar' });
    }
}

export async function calcularPromedio(imageId) {
    const ratings = await Rating.findAll({ where: { image_id: imageId } });
    if (ratings.length === 0) return { promedio: null, cantidad: 0 };
    const suma = ratings.reduce((acc, r) => acc + r.value, 0);
    return {
        promedio: parseFloat((suma / ratings.length).toFixed(1)),
        cantidad: ratings.length
    };
}

export async function usuarioYaVoto(imageId, userId) {
    const rating = await Rating.findOne({
        where: { image_id: imageId, user_id: userId }
    });
    return !!rating;
}