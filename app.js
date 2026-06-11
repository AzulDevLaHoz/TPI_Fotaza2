import express from 'express';
import session from 'express-session';
import 'dotenv/config';
import sequelize from './models/config/config.js';
import './models/sync/sync.js';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import postRoutes from './routes/post.js';
import imageRoutes from './routes/image.js';
import commentRoutes from './routes/comment.js';
import followRoutes from './routes/follow.js';
import ratingRoutes from './routes/rating.js';
import searchRoutes from './routes/search.js';
import homeRoutes from './routes/home.js';
import explorarRoutes from './routes/explorar.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'session_key',
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
app.use('/post', postRoutes);
app.use('/post', imageRoutes);
app.use('/comment', commentRoutes);
app.use('/follows', followRoutes);
app.use('/rating', ratingRoutes);
app.use('/search', searchRoutes);
app.use('/profile', profileRoutes);
app.use('/explorar', explorarRoutes);

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al iniciar:', err);
    });