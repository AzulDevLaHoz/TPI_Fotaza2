import { Op } from 'sequelize';
import { Post, Image, User, Label } from '../models/sync/sync.js';

export async function search(req, res) {
    const { q, label, username } = req.query;

    try {
        const wherePost = { state: 'active' };
        const includeUser = { model: User, attributes: ['id', 'username', 'firstname'] };
        const includeImage = { model: Image };
        const includeLabel = { model: Label };

        if (q && q.trim() !== '') {
            wherePost[Op.or] = [
                { title: { [Op.iLike]: `%${q}%` } },
                { description: { [Op.iLike]: `%${q}%` } }
            ];
        }

        if (username && username.trim() !== '') {
            includeUser.where = { username: { [Op.iLike]: `%${username}%` } };
            includeUser.required = true;
        }

        if (label && label.trim() !== '') {
            includeLabel.where = { name: { [Op.iLike]: `%${label}%` } };
            includeLabel.required = true;
        }

        const posts = await Post.findAll({
            where: wherePost,
            include: [includeUser, includeImage, includeLabel],
            order: [['created_at', 'DESC']]
        });

        res.render('search/results', { posts, query: req.query });
    } catch (error) {
        console.error(error);
        res.render('search/results', { posts: [], query: req.query, error: 'Error en la búsqueda' });
    }
}