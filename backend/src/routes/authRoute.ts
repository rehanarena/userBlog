import express from 'express'
import { loginUser, logoutUser, ProfileUser, registerUser } from '../controllers/authController';
const authRouter = express.Router();

authRouter.post("/register",registerUser);
authRouter.post("/login",loginUser);
authRouter.get('/profile',ProfileUser);
authRouter.post('/logout',logoutUser);



export default authRouter;