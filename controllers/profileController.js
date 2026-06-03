import { User, Post, Image, Label } from '../models/sync/sync.js';

export async function show(req, res) {
    try {
        const profileUser = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Post,
                    where: { state: 'active' },
                    required: false,
                    include: [{ model: Image }, { model: Label }]
                }
            ]
        });

        if (!profileUser) return res.status(404).render('error', { message: 'Usuario no encontrado' });

        // Contar seguidores y seguidos
        const followersCount = await profileUser.countFollower();
        const followingCount = await profileUser.countFollowing();

        // Ver si el usuario logueado ya lo sigue
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