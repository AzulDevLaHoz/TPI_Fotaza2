import { Op } from 'sequelize';
import { Post, Image, User, Label } from '../models/sync/sync.js';

export async function search(req, res) {
    const { q, label, username } = req.query;

    const hayBusqueda = (q && q.trim()) || (label && label.trim()) || (username && username.trim());
    if (!hayBusqueda) {
        return res.render('search/results', { posts: [], usuarios: [], query: req.query });
    }

    try {
        const wherePost    = { state: 'active' };
        const includeImage = { model: Image };
        const includeUser  = { model: User, attributes: ['id', 'username', 'firstname'] };
        const includeLabel = { model: Label };

        // Filtro por título o descripción
        if (q && q.trim() !== '') {
            wherePost[Op.or] = [
                { title:       { [Op.iLike]: `%${q.trim()}%` } },
                { description: { [Op.iLike]: `%${q.trim()}%` } }
            ];
        }

        // Filtro por username en posts
        if (username && username.trim() !== '') {
            const encontrados = await User.findAll({
                where: { username: { [Op.iLike]: `%${username.trim()}%` } },
                attributes: ['id']
            });
            const ids = encontrados.map(u => u.id);
            if (ids.length === 0) {
                return res.render('search/results', { posts: [], usuarios: [], query: req.query });
            }
            wherePost.user_id = { [Op.in]: ids };
        }

        // Filtro por etiqueta
        if (label && label.trim() !== '') {
            includeLabel.where    = { name: { [Op.iLike]: `%${label.trim()}%` } };
            includeLabel.required = true;
        }

        // Buscar posts
        const posts = await Post.findAll({
            where: wherePost,
            include: [includeUser, includeImage, includeLabel],
            order: [['created_at', 'DESC']]
        });

        // Buscar usuarios si hay texto en el campo username
        let usuarios = [];
        if (username && username.trim() !== '') {
            usuarios = await User.findAll({
                where: { username: { [Op.iLike]: `%${username.trim()}%` } },
                attributes: { exclude: ['password'] }
            });
        }

        res.render('search/results', { posts, usuarios, query: req.query });
    } catch (error) {
        console.error(error);
        res.render('search/results', { posts: [], usuarios: [], query: req.query, error: 'Error en la búsqueda' });
    }
}