import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import AppError from '../utils/appError';
import { IUser } from '../models/User';

// Extend Express Request to include user
// Note: Passport also declares user, so we use IUser which is compatible
// We'll use type assertion where needed to avoid conflicts
declare module 'express-serve-static-core' {
    interface Request {
    user?: IUser;
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Get token and check if it exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; iat: number };

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat as number)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

// Restrict to certain roles
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user exists
    if (!req.user) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // Note: Role field not implemented yet in User model
    // For now, this function is a placeholder for future role-based access control
    // You can add a 'role' field to the User model later if needed
    // if (!roles.includes(req.user.role)) {
    //   return next(
    //     new AppError('You do not have permission to perform this action', 403)
    //   );
    // }

    next();
  };
};