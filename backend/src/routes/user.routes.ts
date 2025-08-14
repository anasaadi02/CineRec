import express from 'express';
import { protect } from '../controllers/auth.controller';
import { getMe } from '../controllers/user.controller';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/me', getMe);

export default router;