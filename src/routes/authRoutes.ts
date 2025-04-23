import express from 'express';
import { login, register, refreshToken } from '../services/authService';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', register); 
authRouter.post('/refresh-token', refreshToken);

export default authRouter;