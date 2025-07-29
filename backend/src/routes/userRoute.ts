import express from "express";
import upload from "../middlewares/multer";
import {
  createPost,
  deletePost,
  getMyPosts,
  getPost,
  postDetail,
  publishPost,
  updatePost,
  uploadImage,
} from "../controllers/userController";
import { authUser } from "../middlewares/authUser";

const userRouter = express.Router();

userRouter.post("/creatPost", authUser, upload.single("file"), createPost);
userRouter.get("/post", getPost);
userRouter.get("/post/:id", postDetail);
userRouter.get("/myposts", authUser, getMyPosts);
userRouter.put("/post/publish/:id", publishPost);
userRouter.put("/post/:id", authUser, upload.single("file"), updatePost);
userRouter.post("/upload-image", upload.single("image"), uploadImage);
userRouter.delete("/post/:id", authUser, deletePost);

export default userRouter;


