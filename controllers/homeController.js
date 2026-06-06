import { Post, Image, User, Label } from '../models/sync/sync.js';

export async function index(req, res) {
    try {
        const isLogged = !!req.session.user;
        const imageWhere = isLogged ? {} : { copyright: false };

        const posts = await Post.findAll({
            where: { state: 'active' },
            include: [
                { model: Image, where: imageWhere, required: false },
                { model: User, attributes: ['id', 'username', 'firstname'] },
                { model: Label }
            ],
            order: [['created_at', 'DESC']],
            limit: 20
        });

        res.render('home', { posts });
    } catch (error) {
        console.error(error);
        res.render('home', { posts: [] });
    }
}