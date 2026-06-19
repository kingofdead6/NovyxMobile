import express from 'express';
import multer from 'multer';
import { protect, admin } from '../Middleware/auth.js';
import {
  getAccessoriesCategories,
  getActiveAccessoriesCategories,
  createAccessoriesCategory,
  updateAccessoriesCategory,
  deleteAccessoriesCategory,
} from '../Controllers/accessoriesCategoriesController.js';

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
router.get('/', getAccessoriesCategories);
router.get('/active', getActiveAccessoriesCategories);

// Admin
router.post('/', protect, admin, upload.single('image'), createAccessoriesCategory);
router.put('/:id', protect, admin, upload.single('image'), updateAccessoriesCategory);
router.delete('/:id', protect, admin, deleteAccessoriesCategory);

export default router;
