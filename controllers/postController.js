import { Post, Image, User, Label, Comment, Rating } from '../models/sync/sync.js';
import { aplicarMarcaAgua } from './imageController.js';
import { validarPublicacion, obtenerError } from '../middleware/validates.js';

export async function index(req, res) {
    try {
        const posts = await Post.findAll({
            where: { state: 'active' },
            include: [
                { model: Image },
                { model: User, attributes: ['id', 'username', 'firstname'] },
                { model: Label }
            ],
            order: [['created_at', 'DESC']]
        });
        res.render('posts/index', { posts });
    } catch (error) {
        console.error(error);
        res.render('posts/index', { posts: [], error: 'Error al cargar publicaciones' });
    }
}

export function showCreate(req, res) {
    res.render('posts/create', { error: null });
}

export async function create(req, res) {
    const { title, description, labels, copyright, copyrightText } = req.body;
    const files = req.files;

    // Validación con Zod
    const resultado = validarPublicacion({ title, description, labels, copyrightText });
    if (!resultado.success) {
        return res.render('posts/create', { error: obtenerError(resultado) });
    }

    if (!files || files.length === 0) {
        return res.render('posts/create', { error: 'Tenés que subir al menos una imagen.' });
    }

    try {
        const post = await Post.create({
            title,
            description: description || null,
            user_id: req.session.user.id
        });

        if (labels && labels.trim() !== '') {
            const labelNames = labels.split(',').map(l => l.trim()).filter(l => l);
            for (const name of labelNames) {
                const [label] = await Label.findOrCreate({ where: { name } });
                await post.addLabel(label);
            }
        }

        for (const file of files) {
            let imageBuffer = file.buffer;
            const tieneCopyright = copyright === 'true';

            if (tieneCopyright && copyrightText && copyrightText.trim() !== '') {
                imageBuffer = await aplicarMarcaAgua(file.buffer, copyrightText);
            }

            await Image.create({
                file: imageBuffer,
                copyright: tieneCopyright,
                copyrightText: tieneCopyright ? copyrightText : null,
                post_id: post.id
            });
        }

        res.redirect(`/post/${post.id}`);
    } catch (error) {
        console.error(error);
        res.render('posts/create', { error: 'Error al crear la publicación.' });
    }
}

export async function show(req, res) {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: Image,
                    include: [
                        { model: Comment, include: [{ model: User, attributes: ['id', 'username', 'firstname'] }] },
                        { model: Rating }
                    ]
                },
                { model: User, attributes: ['id', 'username', 'firstname', 'lastname'] },
                { model: Label }
            ]
        });

        if (!post) return res.status(404).render('error', { message: 'Publicación no encontrada' });

        if (!req.session.user) {
            post.Images = post.Images.filter(img => !img.copyright);
        }

        const userRatings = {};
        if (req.session.user) {
            for (const image of post.Images) {
                const rating = image.Ratings.find(r => r.user_id === req.session.user.id);
                userRatings[image.id] = rating ? rating.value : null;
            }
        }

        res.render('posts/show', { post, userRatings });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error al cargar la publicación' });
    }
}

export async function destroy(req, res) {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).render('error', { message: 'No encontrado' });
        if (post.user_id !== req.session.user.id) {
            return res.status(403).render('error', { message: 'No autorizado' });
        }
        await post.destroy();
        res.redirect('/post');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error al eliminar' });
    }
}