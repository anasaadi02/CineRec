import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user is set in the protect middleware
    const user = (req as any).user;
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};