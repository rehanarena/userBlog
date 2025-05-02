import express from 'express';
import upload from '../middlewares/multer';
import { createPost, deletePost, getMyPosts, getPost, postDetail, updatePost } from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/creatPost', upload.single('file'), createPost);
userRouter.get('/post', getPost);
userRouter.get('/post/:id', postDetail);
userRouter.get('/myposts', getMyPosts);
userRouter.put('/post/:id', upload.single('file'), updatePost);
userRouter.delete('/post/:id', deletePost);



export default userRouter;
