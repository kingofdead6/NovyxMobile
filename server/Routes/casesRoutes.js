import express from 'express';
import multer from 'multer';
import { protect, admin } from '../Middleware/auth.js';
import {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
  toggleCaseActive,
} from '../Controllers/casesController.js';

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
router.get('/', getCases);
router.get('/:id', getCaseById);

// Admin
router.post('/', protect, admin, upload.array('images', 8), createCase);
router.put('/:id', protect, admin, upload.array('images', 8), updateCase);
router.patch('/:id/toggle', protect, admin, toggleCaseActive);
router.delete('/:id', protect, admin, deleteCase);

export default router;
