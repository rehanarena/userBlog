// src/controllers/userController.ts
import { Request, Response,RequestHandler } from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from 'path';
import Post from "../models/postModel";

export const createPost = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const { originalname, path: tempPath } = req.file;
  const ext = originalname.split(".").pop();
  const newPath = `${tempPath}.${ext}`;
  fs.renameSync(tempPath, newPath);

  const token = req.cookies.token;
  let payload: { id: string };
  try {
    payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  const { title, summary, content } = req.body;
  try {
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: payload.id,
    });
    res.json({
      success: true,
      postDoc,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const getPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const posts = await Post.find()
    .populate("author", ["name"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
};

export const postDetail = async(req: Request, res: Response):Promise<void> => {
  const {id} = req.params
  const postDoc = await Post.findById(id).populate('author',['name'])
  res.json(postDoc);
}

export const getMyPosts = async (req: Request, res: Response): Promise<void> => {
  // 1. grab the token from cookies
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: 'Not authenticated: no token' });
    return;
  }

  // 2. verify & extract payload
  let payload: { id: string; email?: string };
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email?: string;
    };
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  // 3. use payload.id as the author filter
  try {
    const posts = await Post.find({ author: payload.id }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};


export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, summary, content } = req.body;
  const { id } = req.params;

  // 1) grab token from cookie
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: 'Not authenticated: no token' });
    return;
  }

  // 2) verify & extract user ID
  let payload: { id: string; email?: string };
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email?: string;
    };
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  // 3) basic field check
  if (!title || !summary || !content) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  try {
    // 4) find the post, ensuring author matches
    const post = await Post.findOne({ _id: id, author: payload.id });
    if (!post) {
      res.status(404).json({ error: 'Post not found or not yours' });
      return;
    }

    // 5) apply updates
    post.title   = title;
    post.summary = summary;
    post.content = content;

    // 6) handle new file upload & rename it as you did in createPost
    if (req.file) {
      const { originalname, path: tmpPath } = req.file;
      const ext = path.extname(originalname);
      const newPath = `${tmpPath}${ext}`;
      fs.renameSync(tmpPath, newPath);
      post.cover = newPath;
    }

    // 7) save & respond
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

export const deletePost: RequestHandler = async (req, res): Promise<void> => {
  // 1) Grab the token from cookies
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: 'Not authenticated: no token' });
    return;
  }

  // 2) Verify & extract user ID
  let payload: { id: string; email?: string };
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email?: string;
    };
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  // 3) Attempt deletion, filtering by that user ID
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: payload.id,
    });
    if (!post) {
      res.status(404).json({ error: 'Post not found or not yours' });
      return;
    }

    res.json({ message: 'Post deleted successfully' });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete post' });
    return;
  }
};
