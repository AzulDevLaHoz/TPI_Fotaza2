import { Comment, Image, Post, User } from '../models/sync/sync.js';
import { validarComentario, obtenerError } from '../middleware/validates.js';

// POST tradicional (formulario sin fetch) — imagen única
export async function create(req, res) {
    const { body, imageId, postId } = req.body;

    const resultado = validarComentario({
        body:    body    || '',
        imageId: imageId ? String(imageId) : '',
        postId:  postId  ? String(postId)  : ''
    });

    if (!resultado.success) {
        return res.redirect(`/post/${postId}`);
    }

    try {
        const image = await Image.findByPk(imageId);
        if (!image || !image.activeComments) {
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

// POST via fetch (sin recargar) — modales y imagen única con JS
export async function createAjax(req, res) {
    const { body, imageId, postId } = req.body;

    const resultado = validarComentario({
        body:    body    || '',
        imageId: imageId ? String(imageId) : '',
        postId:  postId  ? String(postId)  : ''
    });

    if (!resultado.success) {
        return res.status(400).json({ error: obtenerError(resultado) });
    }

    try {
        const image = await Image.findByPk(imageId);
        if (!image || !image.activeComments) {
            return res.status(400).json({ error: 'No se puede comentar en esta imagen' });
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

// Toggle abrir/cerrar comentarios de una imagen
export async function toggleComment(req, res) {
    try {
        const image = await Image.findByPk(req.params.imageId, {
            include: [{ model: Post }]
        });

        if (!image) return res.status(404).json({ error: 'Imagen no encontrada' });
        if (image.Post.user_id !== req.session.user.id) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        await image.update({ activeComments: !image.activeComments });
        res.status(200).json({ ok: true, activeComments: !image.activeComments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cambiar estado' });
    }
}

// Eliminar comentario — responde JSON para fetch
export async function destroy(req, res) {
    try {
        const comment = await Comment.findByPk(req.params.id, {
            include: [{ model: Image, include: [{ model: Post }] }]
        });

        if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });

        const esAutorDelPost    = comment.Image.Post.user_id === req.session.user.id;
        const esAutorDelComment = comment.user_id === req.session.user.id;

        if (!esAutorDelPost && !esAutorDelComment) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        await comment.destroy();
        res.status(200).json({ ok: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar comentario' });
    }
}