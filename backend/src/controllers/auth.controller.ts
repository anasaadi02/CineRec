import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { createAndSendToken, signToken } from '../utils/jwt';
import AppError from '../utils/appError';
import { validate, validateLogin, validateRegister } from '../utils/validators';
import { createDefaultLists } from '../utils/createDefaultLists';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Additional validation check (though express-validator should catch this)
    if (password !== passwordConfirm) {
      return next(new AppError('Passwords do not match', 400));
    }

    const newUser = await User.create({
      name,
      email,
      password
    });

    // Create default lists for new user
    await createDefaultLists(newUser._id);

    createAndSendToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, rememberMe } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client with rememberMe option
    createAndSendToken(user, 200, res, rememberMe);
  } catch (error) {
    next(error);
  }
};

// Google OAuth callback handler
export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/signin?error=google_auth_failed`);
    }

    // Create default lists for new Google OAuth users (idempotent - won't create duplicates)
    await createDefaultLists(user._id);

    // Create JWT token
    const token = signToken(user._id.toString());
    
    // Set cookie with same options as regular login
    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    res.cookie('jwt', token, cookieOptions);
    
    // Redirect to frontend success page
    res.redirect(`${process.env.FRONTEND_URL}/auth/google-success`);
  } catch (error) {
    next(error);
  }
};

