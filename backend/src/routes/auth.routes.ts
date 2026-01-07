import express from 'express';
import passport from 'passport';
import { signup, login, googleCallback } from '../controllers/auth.controller';
import { validate, validateRegister, validateLogin } from '../utils/validators';

const router = express.Router();

router.post('/signup', validate(validateRegister), signup);
router.post('/login', validate(validateLogin), login);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/auth/signin?error=google_auth_failed`,
    session: false, // We're using JWT, not sessions
  }),
  googleCallback
);

export default router;