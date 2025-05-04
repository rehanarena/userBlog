import express from 'express'
import { loginUser, logoutUser, ProfileUser, registerUser } from '../controllers/authController';
import { authUser } from '../middlewares/authUser';
const authRouter = express.Router();

authRouter.post("/register",registerUser);
authRouter.post("/login",loginUser);
authRouter.get('/profile',authUser,ProfileUser);
authRouter.post('/logout',logoutUser);



export default authRouter;