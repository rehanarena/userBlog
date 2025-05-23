import { Request, Response } from "express";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { authUser, AuthRequest } from "../middlewares/authUser";
import User from "../models/userModel";


export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Enter details in all fields" });
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(400).json({ error: "Enter a valid email" });
      return;
    }

    if (password.length < 8) {
      res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
      return;
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
      res
        .status(400)
        .json({
          error: "Password must include at least one special character",
        });
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const userDoc = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userDoc,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong on the server" });
  }
};


export const loginUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (!userDoc) {
    res.status(404).json({ error: "Invalid email or password." });
    return 
  }

  const isMatch = await bcryptjs.compare(password, userDoc.password);
  if (!isMatch) {
    res.status(401).json({ error: "Invalid email or password." });
    return 
  }

  // Sign a token that expires in, say, 7 days:
  const token = jwt.sign(
    { id: userDoc._id, email },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" },
  );

  const isProd = process.env.NODE_ENV === "PRODUCTION";

  // Set the cookie
  res
    .cookie("token", token, {
      httpOnly: true,                     
      secure: isProd,                     
      sameSite: isProd ? "none" : "lax",  
      path: "/",                          
      maxAge: 7 * 24 * 60 * 60 * 1000,    
    })
    res.status(200).json({
      success: true,
      userInfo: {
        id: userDoc._id,
        email,
      },
    });    
    
};


  
  export const ProfileUser = async (req: AuthRequest, res: Response): Promise<void> => {
    res.json(req.user);
    
    return 
  }
  

  export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: '/',
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
  };