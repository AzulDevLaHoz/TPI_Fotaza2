import { Rating, Image, Post } from '../models/sync/sync.js';

export async function rate(req, res) {
    const { value, imageId, postId } = req.body;
    const userId = req.session.user.id;

    try {
        const image = await Image.findByPk(imageId, { include: [Post] });
        if (!image) return res.redirect(`/post/${postId}?error=imagen_no_encontrada`);

        // El autor no puede valorar su propia imagen
        if (image.Post.user_id === userId) {
            return res.redirect(`/post/${postId}?error=no_puedes_valorar_tu_imagen`);
        }

        // Solo una valoración por usuario por imagen
        const existing = await Rating.findOne({ where: { user_id: userId, image_id: imageId } });
        if (existing) {
            return res.redirect(`/post/${postId}?error=ya_valoraste`);
        }

        await Rating.create({
            value: parseInt(value),
            user_id: userId,
            image_id: imageId
        });

        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.error(error);
        res.redirect(`/post/${postId}?error=true`);
    }
}