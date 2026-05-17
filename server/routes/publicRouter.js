import { Router } from 'express';
import { getPublicNote } from '../controllers/noteController.js';

const router = Router();

router.get('/:publicId', getPublicNote);

export default router;
