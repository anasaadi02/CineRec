import express from 'express';
import { protect } from '../middlewares/auth.middleware';
import {
  getAllLists,
  getList,
  createList,
  updateList,
  deleteList,
  addMovieToList,
  removeMovieFromList,
  getListByType
} from '../controllers/list.controller';

const router = express.Router();

// Protect all routes
router.use(protect);

// Get list by type (watchlist, liked, rated)
router.get('/type/:type', getListByType);

// Get all lists
router.get('/', getAllLists);

// Get a single list
router.get('/:id', getList);

// Create a new list
router.post('/', createList);

// Update a list
router.patch('/:id', updateList);

// Delete a list
router.delete('/:id', deleteList);

// Add movie to list
router.post('/:id/movies', addMovieToList);

// Remove movie from list
router.delete('/:listId/movies/:movieId', removeMovieFromList);

export default router;
