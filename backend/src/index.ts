import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb";
import authRouter from "./routes/authRoute";
import userRouter from "./routes/userRoute";
import fs from "fs";
import path from "path";

//api config
const app = express();
const port = process.env.PORT || 3000;

dotenv.config();
connectDB();

//middlewares
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["https://userblog-three.vercel.app"];
app.use('*',
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "token",
    ],
    credentials: true,
  })
);

//api endpoint
app.get("/api", (req, res) => {
  res.send("Api Working");
});

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => console.log("Server Started", port));
