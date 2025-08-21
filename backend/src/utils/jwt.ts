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

export const createAndSendToken = (user: any, statusCode: number, res: Response, rememberMe?: boolean) => {
  const token = signToken(user._id);
  
  // Set cookie expiration based on rememberMe
  let cookieOptions: any = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const
  };

  if (rememberMe) {
    // If rememberMe is true, set cookie to expire in 30 days
    cookieOptions.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  // If rememberMe is false or undefined, don't set expires (session cookie)
  // This means the cookie will expire when the browser is closed

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