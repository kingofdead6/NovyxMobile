import express from 'express';
import multer from 'multer';
import {
  getAllSellRequests,
  createSellRequest,
  deleteSellRequest,
} from '../Controllers/sellRequestController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public route
router.post('/', upload.array('images', 10), createSellRequest);

// Admin routes
router.get('/', getAllSellRequests);
router.delete('/:id', deleteSellRequest);

export default router;