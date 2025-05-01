import { Request, Response } from 'express';
import fs from 'fs';
import Post from '../models/postModel';

export const post = async (req: Request, res: Response):Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return
  }

  const { originalname, path: tempPath } = req.file;
  const ext = originalname.split('.').pop();
  const newPath = `${tempPath}.${ext}`;

  fs.renameSync(tempPath, newPath);

  const { title, summary, content } = req.body;
  try {
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
    });
    res.json({ postDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};
