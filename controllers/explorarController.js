import { Post, Image, User, Label } from '../models/sync/sync.js';

export async function explorar(req, res) {
    if (req.session.user) return res.redirect('/');

    try {
        const posts = await Post.findAll({
            where: { state: 'active' },
            include: [
                { model: Image, where: { copyright: false }, required: true },
                { model: User, attributes: ['id', 'username', 'firstname'] },
                { model: Label }
            ],
            order: [['created_at', 'DESC']],
            limit: 30
        });

        res.render('explorar', { posts });
    } catch (error) {
        console.error(error);
        res.render('explorar', { posts: [] });
    }
}