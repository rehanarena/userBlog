import express from 'express';
import upload from '../middlewares/multer';
import { post } from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/createPost', upload.single('file'), post);

export default userRouter;
