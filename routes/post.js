import { Router } from 'express';
import multer from 'multer';
import { index, showCreate, create, show, destroy } from '../controllers/postController.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Solo imágenes'));
    }
});

router.get('/', index);
router.get('/create', requireLogin, showCreate);
router.post('/create', requireLogin, upload.array('images', 10), create);
router.get('/:id', show);
router.post('/:id/delete', requireLogin, destroy);

export default router;