import express from 'express';
import multer from 'multer';
import { protect, admin } from '../Middleware/auth.js';
import {
  getAccessories,
  getAccessoryById,
  createAccessory,
  updateAccessory,
  deleteAccessory,
  toggleAccessoryActive,
} from '../Controllers/accessoriesController.js';

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
router.get('/', getAccessories);
router.get('/:id', getAccessoryById);

// Admin
router.post('/', protect, admin, upload.array('images', 8), createAccessory);
router.put('/:id', protect, admin, upload.array('images', 8), updateAccessory);
router.patch('/:id/toggle', protect, admin, toggleAccessoryActive);
router.delete('/:id', protect, admin, deleteAccessory);

export default router;
