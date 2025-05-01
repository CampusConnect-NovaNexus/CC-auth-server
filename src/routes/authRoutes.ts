import express from 'express';
import { getUserById, login, refreshToken, register } from '../services/authService';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', register); 
authRouter.post('/refresh-token', refreshToken);
authRouter.get('/user/:id', getUserById);


export default authRouter;