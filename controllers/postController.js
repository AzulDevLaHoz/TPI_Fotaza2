import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { Post, Image, User, Label, Comment } from '../models/sync/sync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Listar todos los posts activos
export async function index(req, res) {
    try {
        const posts = await Post.findAll({
            where: { state: 'active' },
            include: [
                { model: Image },
                { model: User, attributes: ['id', 'username'] },
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

// Formulario de nueva publicación
export function showCreate(req, res) {
    res.render('posts/create', { error: null });
}

// Crear publicación
export async function create(req, res) {
    const { title, description, labels, copyright, copyrightText } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.render('posts/create', { error: 'Tenés que subir al menos una imagen.' });
    }

    try {
        const post = await Post.create({
            title,
            description: description || null,
            user_id: req.session.user.id
        });

        if (labels) {
            const labelNames = labels.split(',').map(l => l.trim()).filter(l => l);
            for (const name of labelNames) {
                const [label] = await Label.findOrCreate({ where: { name } });
                await post.addLabel(label);
            }
        }

        for (const file of files) {
            let imageBuffer = file.buffer;

            if (copyright === 'true' && copyrightText) {
                const svgText = `
                    <svg width="400" height="50">
                        <text x="10" y="35" font-size="28" fill="rgba(255,255,255,0.6)"
                              font-family="Arial" font-weight="bold">© ${copyrightText}</text>
                    </svg>`;
                imageBuffer = await sharp(file.buffer)
                    .composite([{ input: Buffer.from(svgText), gravity: 'south' }])
                    .jpeg()
                    .toBuffer();
            }

            await Image.create({
                file: imageBuffer,
                copyright: copyright === 'true',
                copyrightText: copyrightText || null,
                post_id: post.id
            });
        }

        res.redirect(`/post/${post.id}`);
    } catch (error) {
        console.error(error);
        res.render('posts/create', { error: 'Error al crear la publicación.' });
    }
}

// Ver publicación individual
export async function show(req, res) {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: Image,
                    include: [
                        {
                            model: Comment,
                            include: [{ model: User, attributes: ['id', 'username'] }]
                        }
                    ]
                },
                { model: User, attributes: ['id', 'username', 'firstname', 'lastname'] },
                { model: Label }
            ]
        });

        if (!post) return res.status(404).render('error', { message: 'Publicación no encontrada' });

        res.render('posts/show', { post });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error al cargar la publicación' });
    }
}

// Eliminar publicación (solo el autor)
export async function destroy(req, res) {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ error: 'No encontrado' });
        if (post.user_id !== req.session.user.id) {
            return res.status(403).json({ error: 'No autorizado' });
        }
        await post.destroy();
        res.redirect('/post');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar' });
    }
}