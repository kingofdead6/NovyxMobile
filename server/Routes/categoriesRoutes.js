import express from 'express';
import { protect, admin } from '../Middleware/auth.js';
import { 
  getCategories, 
  createCategory, 
  deleteCategory 
} from '../Controllers/categories.js';

import multer from 'multer';

// Multer setup (single image upload)
const storage = multer.memoryStorage(); // or diskStorage if you prefer
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const router = express.Router();

// Routes
router.post("/", protect, admin, upload.single('image'), createCategory);   // ← image field name
router.get("/", getCategories);
router.delete("/:id", protect, admin, deleteCategory);

export default router;