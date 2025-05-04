import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from "./config/mongodb";
import authRouter from './routes/authRoute'
import userRouter from "./routes/userRoute";
import fs from "fs";
import path from "path";


//api config
const app = express()
const port = process.env.PORT || 3000

dotenv.config();  
connectDB();

//middlewares
app.use(express.json())
app.use(cookieParser());

const isProd = process.env.NODE_ENV === 'PRODUCTION';
const allowedOrigins = [
  isProd 
    ? process.env.PROD_CLIENT_LINK! 
    : process.env.DEV_CLIENT_LINK!,
];

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      if (!incomingOrigin || allowedOrigins.includes(incomingOrigin)) {
        return callback(null, true);
      }
      callback(new Error(`Origin ${incomingOrigin} not allowed by CORS`));
    },
    credentials: true,
    methods:['POST','GET','PUT','OPTIONS','DELETE']
  })
);


//api endpoint
app.get('/api',(req,res)=>{
    res.send('Api Working')
});


const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//Routes
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.listen(port,()=>console.log('Server Started',port));
