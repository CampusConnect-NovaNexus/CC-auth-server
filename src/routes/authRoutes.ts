import express from 'express';
import { getUserById, login, refreshToken, register } from '../services/authService';
import { addProfile, getProfile } from '../services/socialsService';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', register); 
authRouter.post('/refresh-token', refreshToken);
authRouter.get('/user/:id', getUserById);
authRouter.post('/user/addSocials', addProfile);
authRouter.get('/user/getProfile/:userId', getProfile);

export default authRouter;