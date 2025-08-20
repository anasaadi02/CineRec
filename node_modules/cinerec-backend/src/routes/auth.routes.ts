import express from 'express';
import { signup, login } from '../controllers/auth.controller';
import { validate, validateRegister, validateLogin } from '../utils/validators';

const router = express.Router();

router.post('/signup', validate(validateRegister), signup);
router.post('/login', validate(validateLogin), login);

export default router;