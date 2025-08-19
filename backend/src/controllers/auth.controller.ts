import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { createAndSendToken } from '../utils/jwt';
import AppError from '../utils/appError';
import { validate, validateLogin, validateRegister } from '../utils/validators';

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

    createAndSendToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    createAndSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};



