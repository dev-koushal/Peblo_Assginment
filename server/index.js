import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRouter from "./routes/authRouter.js";
import noteRouter from "./routes/noteRouter.js";
import publicRouter from "./routes/publicRouter.js";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.disable("x-powered-by");

/** 
 * -Middleware
 * -Body parser
 * -CORS
 * -Route handlers
 * -Error handling
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));

app.use(cookieParser());

/**
 * -Routes
 */

app.use("/auth", authRouter);
app.use('/api/notes', noteRouter);
app.use('/public', publicRouter);


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.log(error);
  }
};

startServer();