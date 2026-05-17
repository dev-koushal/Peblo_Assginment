import { Router } from 'express';
import {
  createNote,
  updateNote,
  getNotes,
  getNote,
  archiveNote,
  deleteNote,
  shareNote,
  unshareNote,
  getInsights
} from '../controllers/noteController.js';
import { protect } from '../middlewares/authMiddleware.js';

import { generateAI } from '../controllers/aiController.js';
const router = Router();

router.use(protect);

router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNote);
router.patch('/:id', updateNote);
router.post('/:id/archive', archiveNote);
router.delete('/:id', deleteNote);
router.post('/:id/share', shareNote);
router.post('/:id/unshare', unshareNote);
router.get('/insights', getInsights);
router.post(
  "/:id/ai",
  protect,
  generateAI
);

export default router;
