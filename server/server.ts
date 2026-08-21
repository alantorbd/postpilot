import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

//database connection
await connectDB();

//middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is Live!");
});

//Global Error Handler
app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
