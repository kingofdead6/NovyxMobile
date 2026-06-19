import express from 'express';
import multer from 'multer';
import {
  createRepairRequest,
  getAllRepairRequests,
  deleteRepairRequest,
} from '../Controllers/repairRequestController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public route
router.post('/', upload.array('images', 8), createRepairRequest);

// Admin routes
router.get('/', getAllRepairRequests);
router.delete('/:id', deleteRepairRequest);

export default router;