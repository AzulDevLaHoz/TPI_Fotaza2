import { Comment, Image, Post, User } from '../models/sync/sync.js';

// Agregar comentario
export async function create(req, res) {
    const { body, imageId, postId } = req.body;

    try {
        const image = await Image.findByPk(imageId);
        if (!image) return res.status(404).json({ error: 'Imagen no encontrada' });

        if (!image.activeComments) {
            return res.redirect(`/post/${postId}?error=comentarios_cerrados`);
        }

        await Comment.create({
            body,
            user_id: req.session.user.id,
            image_id: imageId
        });

        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.error(error);
        res.redirect(`/post/${postId}?error=true`);
    }
}

// Abrir / cerrar comentarios (solo el autor del post)
export async function toggleComment(req, res) {
    try {
        const image = await Image.findByPk(req.params.imageId, {
            include: [{ model: Post }]
        });

        if (!image) return res.status(404).json({ error: 'No encontrada' });
        if (image.Post.user_id !== req.session.user.id) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        await image.update({ activeComments: !image.activeComments });
        res.redirect(`/post/${image.post_id}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error' });
    }
}

// Eliminar comentario
export async function destroy(req, res) {
    try {
        const comment = await Comment.findByPk(req.params.id, {
            include: [{ model: Image, include: [{ model: Post }] }]
        });

        if (!comment) return res.status(404).json({ error: 'No encontrado' });

        const esAutorDelPost = comment.Image.Post.user_id === req.session.user.id;
        const esAutorDelComment = comment.user_id === req.session.user.id;

        if (!esAutorDelPost && !esAutorDelComment) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        await comment.destroy();
        res.redirect(`/post/${comment.Image.post_id}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar comentario' });
    }
}