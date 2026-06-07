import { User } from '../models/sync/sync.js';

export async function follow(req, res) {
    const followerId = req.session.user.id;
    const followingId = parseInt(req.params.userId);

    if (followerId === followingId) {
        return res.redirect(`/profile/${followingId}`);
    }

    try {
        const userToFollow = await User.findByPk(followingId);
        if (!userToFollow) return res.status(404).render('error', { message: 'Usuario no encontrado' });

        const follower = await User.findByPk(followerId);

        const alreadyFollowing = await follower.hasFollowing(userToFollow);
        if (!alreadyFollowing) {
            await follower.addFollowing(userToFollow);
        }

        res.redirect(`/profile/${followingId}`);
    } catch (error) {
        console.error(error);
        res.redirect(`/profile/${followingId}`);
    }
}

export async function unfollow(req, res) {
    const followerId = req.session.user.id;
    const followingId = parseInt(req.params.userId);

    try {
        const follower = await User.findByPk(followerId);
        const userToUnfollow = await User.findByPk(followingId);

        if (!userToUnfollow) return res.status(404).render('error', { message: 'Usuario no encontrado' });

        await follower.removeFollowing(userToUnfollow);
        res.redirect(`/profile/${followingId}`);
    } catch (error) {
        console.error(error);
        res.redirect(`/profile/${followingId}`);
    }
}
