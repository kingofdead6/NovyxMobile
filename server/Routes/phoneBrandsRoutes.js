import express from 'express';
import multer from 'multer';
import { protect, admin } from '../Middleware/auth.js';
import {
  getPhoneBrands,
  getActivePhoneBrands,
  createPhoneBrand,
  updatePhoneBrand,
  deletePhoneBrand,
} from '../Controllers/phoneBrandsController.js';

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
router.get('/', getPhoneBrands);
router.get('/active', getActivePhoneBrands);

// Admin
router.post('/', protect, admin, upload.single('logo'), createPhoneBrand);
router.put('/:id', protect, admin, upload.single('logo'), updatePhoneBrand);
router.delete('/:id', protect, admin, deletePhoneBrand);

export default router;
