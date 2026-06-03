import { Router } from 'express';
import multer from 'multer';
import { index, showCreate, create, show, destroy } from '../controllers/postController.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

// Multer en memoria (guardamos el buffer en la BD)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif)'));
        }
    }
});

router.get('/', index);
router.get('/create', requireLogin, showCreate);
router.post('/create', requireLogin, upload.array('images', 10), create);
router.get('/:id', show);
router.post('/:id/delete', requireLogin, destroy);

export default router;