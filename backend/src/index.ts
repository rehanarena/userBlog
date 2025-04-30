import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from "./config/mongodb";
import authRouter from './routes/authRoute'


//api config
const app = express()
const port = process.env.PORT || 3000

dotenv.config();  
connectDB();
console.log("🔍 -> MONGODB_URI is:", process.env.MONGODB_URI);

//middlewares
app.use(express.json())
app.use(cookieParser());
app.use(
    cors({
      origin: "http://localhost:5173",  
      credentials: true,                
    })
  );

//api endpoint
app.get('/api',(req,res)=>{
    res.send('Api Working')
});

//Routes
app.use("/api/auth",authRouter)

app.listen(port,()=>console.log('Server Started',port));
