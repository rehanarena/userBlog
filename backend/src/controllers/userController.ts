import { Request, Response, RequestHandler } from "express";
import fs from "fs";
import path from "path";
import Post from "../models/postModel";
import { AuthRequest } from "../middlewares/authUser";

export const createPost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    let coverPath = "";
    if (req.file) {
      const { originalname, path: tempPath } = req.file;
      const ext = originalname.split(".").pop();
      const newPath = `${tempPath}.${ext}`;
      fs.renameSync(tempPath, newPath);
      coverPath = newPath;
    }

    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { title, summary, content } = req.body;
    if (!title || !summary || !content) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const newPost = await Post.create({
      title,
      summary,
      content,
      cover: coverPath,
      author: userId,
      published: false,
    });

    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const uploadImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image uploaded" });
      return;
    }

    const { filename } = req.file;
    const fileUrl = `/uploads/${filename}`;

    res.status(200).json({ url: fileUrl });
    return;
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Image upload failed" });
  }
};

export const getPost = async (req: Request, res: Response): Promise<void> => {
  const posts = await Post.find({ published: true })
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(posts);
};

export const postDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["name"]);
  res.json(postDoc);
};

export const getMyPosts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const publishPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(
    id,
    { published: true },
    { new: true }
  );
  res.json(post);
};

export const updatePost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { title, summary, content } = req.body;
  const { id } = req.params;

  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!title || !summary || !content) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    const post = await Post.findOne({ _id: id, author: userId });
    if (!post) {
      res.status(404).json({ error: "Post not found or not yours" });
      return;
    }
    post.title = title;
    post.summary = summary;
    post.content = content;

    if (req.file) {
      const { originalname, path: tmpPath } = req.file;
      const ext = path.extname(originalname);
      const newPath = `${tmpPath}${ext}`;
      fs.renameSync(tmpPath, newPath);
      post.cover = newPath;
    }
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update post" });
  }
};

export const deletePost: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: "Not authenticated: no token" });
    return;
  }

  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: userId,
    });
    if (!post) {
      res.status(404).json({ error: "Post not found or not yours" });
      return;
    }

    res.json({ message: "Post deleted successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete post" });
    return;
  }
};
