import { User, Post, Image, Label } from '../models/sync/sync.js';

export async function show(req, res) {
    try {
        const profileId = req.params.id || (req.session.user ? req.session.user.id : null);
        if (!profileId) return res.redirect('/auth/login');

        const profileUser = await User.findByPk(profileId, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Post,
                    where: { state: 'active' },
                    required: false,
                    include: [
                        { model: Image },
                        { model: Label },
                        { model: User, attributes: ['id', 'username', 'firstname'] }
                    ]
                }
            ]
        });

        if (!profileUser) return res.status(404).render('error', { message: 'Usuario no encontrado' });

        const followersCount = await profileUser.countFollower();
        const followingCount = await profileUser.countFollowing();

        let isFollowing = false;
        if (req.session.user && req.session.user.id !== profileUser.id) {
            const me = await User.findByPk(req.session.user.id);
            isFollowing = await me.hasFollowing(profileUser);
        }

        res.render('profile/show', {
            profileUser,
            followersCount,
            followingCount,
            isFollowing
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error al cargar el perfil' });
    }
}