import express from 'express';
import multer from 'multer';
import { protect, admin } from '../Middleware/auth.js';
import {
  getPhones,
  getFeaturedPhones,
  getPhoneById,
  createPhone,
  updatePhone,
  deletePhone,
  togglePhoneActive,
} from '../Controllers/phonesController.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
});

// Public
router.get('/', getPhones);
router.get('/featured', getFeaturedPhones);
router.get('/:id', getPhoneById);

// Admin
router.post('/', protect, admin, upload.array('images', 10), createPhone);
router.put('/:id', protect, admin, upload.array('images', 10), updatePhone);
router.patch('/:id/toggle', protect, admin, togglePhoneActive);
router.delete('/:id', protect, admin, deletePhone);

export default router;
