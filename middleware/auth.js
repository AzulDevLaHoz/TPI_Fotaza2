export function requireLogin(req, res, next) {
    if (!req.session.user) return res.redirect('/auth/login');
    next();
}

export function requireValidator(req, res, next) {
    if (!req.session.user ||
        (req.session.user.rol !== 'validador' && req.session.user.rol !== 'admin')) {
        return res.status(403).render('error', { message: 'No tenés permiso para acceder.' });
    }
    next();
}