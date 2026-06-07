import { Comment, Image, Post, User } from '../models/sync/sync.js';

export async function create(req, res) {
    const { body, imageId, postId } = req.body;
    try {
        const image = await Image.findByPk(imageId);
        if (!image) return res.status(404).render('error', { message: 'Imagen no encontrada' });

        if (!image.activeComments) {
            return res.redirect(`/post/${postId}`);
        }

        await Comment.create({
            body,
            user_id: req.session.user.id,
            image_id: imageId
        });

        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.error(error);
        res.redirect(`/post/${postId}`);
    }
}

export async function toggleComment(req, res) {
    try {
        const image = await Image.findByPk(req.params.imageId, {
            include: [{ model: Post }]
        });

        if (!image) return res.status(404).render('error', { message: 'Imagen no encontrada' });
        if (image.Post.user_id !== req.session.user.id) {
            return res.status(403).render('error', { message: 'No autorizado' });
        }

        await image.update({ activeComments: !image.activeComments });
        res.redirect(`/post/${image.post_id}`);
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error al cambiar estado de comentarios' });
    }
}

export async function destroy(req, res) {
    try {
        const comment = await Comment.findByPk(req.params.id, {
            include: [{ model: Image, include: [{ model: Post }] }]
        });

        if (!comment) return res.status(404).render('error', { message: 'Comentario no encontrado' });

        const esAutorDelPost = comment.Image.Post.user_id === req.session.user.id;
        const esAutorDelComment = comment.user_id === req.session.user.id;

        if (!esAutorDelPost && !esAutorDelComment) {
            return res.status(403).render('error', { message: 'No autorizado' });
        }

        const postId = comment.Image.post_id;
        await comment.destroy();
        res.redirect(`/post/${postId}`);
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error al eliminar comentario' });
    }
}

export async function createAjax(req, res) {
    const { body, imageId, postId } = req.body;
    try {
        const image = await Image.findByPk(imageId);
        if (!image || !image.activeComments) {
            return res.status(400).json({ error: 'No se puede comentar' });
        }
        await Comment.create({
            body,
            user_id: req.session.user.id,
            image_id: imageId
        });
        res.status(200).json({ ok: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al comentar' });
    }
}