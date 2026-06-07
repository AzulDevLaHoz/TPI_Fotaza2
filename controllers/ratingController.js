import { Rating, Image, Post } from '../models/sync/sync.js';

export async function rate(req, res) {
    const { value, imageId, postId } = req.body;
    const userId = req.session.user.id;

    try {
        const image = await Image.findByPk(imageId, {
            include: [{ model: Post }]
        });

        if (!image) return res.redirect(`/post/${postId}`);

        // El autor no puede valorar su propia imagen
        if (image.Post.user_id === userId) {
            return res.redirect(`/post/${postId}`);
        }

        // Un usuario solo puede valorar una vez por imagen
        const existing = await Rating.findOne({
            where: { user_id: userId, image_id: imageId }
        });

        if (existing) return res.redirect(`/post/${postId}`);

        await Rating.create({
            value: parseInt(value),
            user_id: userId,
            image_id: imageId
        });

        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.error(error);
        res.redirect(`/post/${postId}`);
    }
}

// Auxiliar: calcular promedio de una imagen
export async function calcularPromedio(imageId) {
    const ratings = await Rating.findAll({ where: { image_id: imageId } });
    if (ratings.length === 0) return { promedio: null, cantidad: 0 };
    const suma = ratings.reduce((acc, r) => acc + r.value, 0);
    return {
        promedio: parseFloat((suma / ratings.length).toFixed(1)),
        cantidad: ratings.length
    };
}

// Auxiliar: verificar si un usuario ya votó una imagen
export async function usuarioYaVoto(imageId, userId) {
    const rating = await Rating.findOne({
        where: { image_id: imageId, user_id: userId }
    });
    return !!rating;
}
