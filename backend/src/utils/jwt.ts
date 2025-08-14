import jwt, { SignOptions } from 'jsonwebtoken';
import { Response } from 'express';

const signToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  } as SignOptions;
  
  return jwt.sign({ id }, process.env.JWT_SECRET, options);
};

export const createAndSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN as unknown as number) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  // Remove password from output
  user.password = undefined;

  res.cookie('jwt', token, cookieOptions).status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};