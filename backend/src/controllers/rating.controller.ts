import { Request, Response, NextFunction } from 'express';
import Rating from '../models/Rating';
import List from '../models/List';
import AppError from '../utils/appError';

// Rate a movie or TV show
export const rateMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { movieId, mediaType, rating, title, posterPath, releaseDate } = req.body;

    // Validate input
    if (!movieId || !mediaType || !rating) {
      return next(new AppError('Movie ID, media type, and rating are required', 400));
    }

    if (!['movie', 'tv'].includes(mediaType)) {
      return next(new AppError('Media type must be either "movie" or "tv"', 400));
    }

    if (rating < 1 || rating > 10) {
      return next(new AppError('Rating must be between 1 and 10', 400));
    }

    // Find or create rating
    let userRating = await Rating.findOne({
      user: user._id,
      movieId,
      mediaType
    });

    if (userRating) {
      // Update existing rating
      userRating.rating = rating;
      await userRating.save();
    } else {
      // Create new rating
      userRating = await Rating.create({
        user: user._id,
        movieId,
        mediaType,
        rating
      });
    }

    // Add to "Rated" list if not already there
    if (title) {
      let ratedList = await List.findOne({
        user: user._id,
        listType: 'rated'
      });

      // Create rated list if it doesn't exist
      if (!ratedList) {
        ratedList = await List.create({
          name: 'Rated',
          user: user._id,
          isDefault: true,
          listType: 'rated',
          movies: []
        });
      }

      // Check if movie/show already exists in the list
      const movieExists = ratedList.movies.some(movie => movie.movieId === movieId);
      if (!movieExists) {
        ratedList.movies.push({
          movieId,
          title,
          posterPath,
          releaseDate,
          addedAt: new Date()
        });
        await ratedList.save();
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        rating: userRating
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user's rating for a specific movie/show
export const getUserRating = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { movieId } = req.params;
    const { mediaType } = req.query;

    if (!mediaType || !['movie', 'tv'].includes(mediaType as string)) {
      return next(new AppError('Valid media type is required', 400));
    }

    const rating = await Rating.findOne({
      user: user._id,
      movieId: Number(movieId),
      mediaType: mediaType as 'movie' | 'tv'
    });

    res.status(200).json({
      status: 'success',
      data: {
        rating: rating || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// Remove rating (unrate)
export const removeRating = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { movieId } = req.params;
    const { mediaType } = req.query;

    if (!mediaType || !['movie', 'tv'].includes(mediaType as string)) {
      return next(new AppError('Valid media type is required', 400));
    }

    // Remove rating
    await Rating.findOneAndDelete({
      user: user._id,
      movieId: Number(movieId),
      mediaType: mediaType as 'movie' | 'tv'
    });

    // Remove from "Rated" list
    const ratedList = await List.findOne({
      user: user._id,
      listType: 'rated'
    });

    if (ratedList) {
      ratedList.movies = ratedList.movies.filter(
        movie => movie.movieId !== Number(movieId)
      );
      await ratedList.save();
    }

    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Get all ratings for the current user
export const getUserRatings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const ratings = await Rating.find({ user: user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: ratings.length,
      data: {
        ratings
      }
    });
  } catch (error) {
    next(error);
  }
};
