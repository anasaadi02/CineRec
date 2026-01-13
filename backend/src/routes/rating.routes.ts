import express from 'express';
import { protect } from '../middlewares/auth.middleware';
import {
  rateMedia,
  getUserRating,
  removeRating,
  getUserRatings
} from '../controllers/rating.controller';

const router = express.Router();

// Protect all routes
router.use(protect);

// Rate a movie/show
router.post('/', rateMedia);

// Get all ratings for the current user (must come before /:movieId)
router.get('/', getUserRatings);

// Get user's rating for a specific movie/show
router.get('/:movieId', getUserRating);

// Remove rating
router.delete('/:movieId', removeRating);

export default router;
