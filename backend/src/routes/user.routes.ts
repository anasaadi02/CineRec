import express from 'express';
import { protect } from '../middlewares/auth.middleware';
import { getMe } from '../controllers/user.controller';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/me', getMe);

export default router;