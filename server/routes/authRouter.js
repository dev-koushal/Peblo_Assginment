import {Router} from 'express';
import { signup, login, logout, getCurrentUser } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/me', protect, getCurrentUser);

export default authRouter;