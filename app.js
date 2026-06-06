import express from 'express';
import session from 'express-session';
import 'dotenv/config';
import sequelize from './models/config/config.js';
import './models/sync/sync.js';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import postRoutes from './routes/post.js';
import commentRoutes from './routes/comment.js';
import followRoutes from './routes/follow.js';
import ratingRoutes from './routes/rating.js';
import searchRoutes from './routes/search.js';
import homeRoutes from './routes/home.js';
import imageRoutes from './routes/image.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto_fotaza',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);
app.use('/follows', followRoutes);
app.use('/rating', ratingRoutes);
app.use('/search', searchRoutes);
app.use('/image', imageRoutes);

app.get('/', async (req, res) => {
    try {
        const { Post, Image, User, Label } = await import('./models/sync/sync.js');
        const posts = await Post.findAll({
            where: { state: 'active' },
            include: [
                { model: Image },
                { model: User, attributes: ['id', 'username'] },
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
});

sequelize.sync({ alter: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al iniciar:', err);
    });