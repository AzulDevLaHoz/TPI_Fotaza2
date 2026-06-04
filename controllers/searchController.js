import { Op } from 'sequelize';
import { Post, Image, User, Label } from '../models/sync/sync.js';

export async function search(req, res) {
    const { q, label, username, copyright } = req.query;

    try {
        const wherePost = { state: 'active' };
        const includeUser = { model: User, attributes: ['id', 'username'] };
        const includeImage = { model: Image };
        const includeLabel = { model: Label };

        // Filtro por título o descripción
        if (q) {
            wherePost[Op.or] = [
                { title: { [Op.iLike]: `%${q}%` } },
                { description: { [Op.iLike]: `%${q}%` } }
            ];
        }

        // Filtro por usuario
        if (username) {
            includeUser.where = { username: { [Op.iLike]: `%${username}%` } };
            includeUser.required = true;
        }

        // Filtro por etiqueta
        if (label) {
            includeLabel.where = { name: { [Op.iLike]: `%${label}%` } };
            includeLabel.required = true;
        }

        // Filtro por copyright
        if (copyright !== undefined && copyright !== '') {
            includeImage.where = { copyright: copyright === 'true' };
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