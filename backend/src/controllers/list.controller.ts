import { Request, Response, NextFunction } from 'express';
import List from '../models/List';
import AppError from '../utils/appError';

// Get all lists for the current user
export const getAllLists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const lists = await List.find({ user: user._id }).sort({ isDefault: -1, createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: lists.length,
      data: {
        lists
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a single list by ID
export const getList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const list = await List.findOne({ _id: req.params.id, user: user._id });
    
    if (!list) {
      return next(new AppError('No list found with that ID', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        list
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new list
export const createList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
      return next(new AppError('List name is required', 400));
    }
    
    // Check if list with same name already exists for this user
    const existingList = await List.findOne({ user: user._id, name: name.trim() });
    if (existingList) {
      return next(new AppError('A list with this name already exists', 400));
    }
    
    const newList = await List.create({
      name: name.trim(),
      user: user._id,
      isDefault: false,
      listType: 'custom',
      movies: []
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        list: newList
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update list name
export const updateList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
      return next(new AppError('List name is required', 400));
    }
    
    const list = await List.findOne({ _id: req.params.id, user: user._id });
    
    if (!list) {
      return next(new AppError('No list found with that ID', 404));
    }
    
    // Prevent renaming default lists
    if (list.isDefault) {
      return next(new AppError('Cannot rename default lists', 400));
    }
    
    // Check if another list with same name exists
    const existingList = await List.findOne({ 
      user: user._id, 
      name: name.trim(),
      _id: { $ne: req.params.id }
    });
    if (existingList) {
      return next(new AppError('A list with this name already exists', 400));
    }
    
    list.name = name.trim();
    await list.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        list
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a list
export const deleteList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const list = await List.findOne({ _id: req.params.id, user: user._id });
    
    if (!list) {
      return next(new AppError('No list found with that ID', 404));
    }
    
    // Prevent deleting default lists
    if (list.isDefault) {
      return next(new AppError('Cannot delete default lists', 400));
    }
    
    await List.findByIdAndDelete(req.params.id);
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Add a movie to a list
export const addMovieToList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { movieId, title, posterPath, releaseDate } = req.body;
    
    if (!movieId || !title) {
      return next(new AppError('Movie ID and title are required', 400));
    }
    
    const list = await List.findOne({ _id: req.params.id, user: user._id });
    
    if (!list) {
      return next(new AppError('No list found with that ID', 404));
    }
    
    // Check if movie already exists in the list
    const movieExists = list.movies.some(movie => movie.movieId === movieId);
    if (movieExists) {
      return next(new AppError('Movie already exists in this list', 400));
    }
    
    // Add movie to list
    list.movies.push({
      movieId,
      title,
      posterPath,
      releaseDate,
      addedAt: new Date()
    });
    
    await list.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        list
      }
    });
  } catch (error) {
    next(error);
  }
};

// Remove a movie from a list
export const removeMovieFromList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { movieId } = req.params;
    
    const list = await List.findOne({ _id: req.params.listId, user: user._id });
    
    if (!list) {
      return next(new AppError('No list found with that ID', 404));
    }
    
    // Remove movie from list
    list.movies = list.movies.filter(movie => movie.movieId !== Number(movieId));
    await list.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        list
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get list by type (for quick access to watchlist, liked, rated)
export const getListByType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { type } = req.params;
    
    if (!['watchlist', 'liked', 'rated'].includes(type)) {
      return next(new AppError('Invalid list type', 400));
    }
    
    let list = await List.findOne({ user: user._id, listType: type });
    
    // If list doesn't exist, create it (for default lists)
    if (!list) {
      const listNames: { [key: string]: string } = {
        watchlist: 'Watchlist',
        liked: 'Liked',
        rated: 'Rated'
      };
      
      list = await List.create({
        name: listNames[type],
        user: user._id,
        isDefault: true,
        listType: type as 'watchlist' | 'liked' | 'rated',
        movies: []
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        list
      }
    });
  } catch (error) {
    next(error);
  }
};
