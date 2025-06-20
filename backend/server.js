import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import { userRouter } from "./src/routes/userRoute.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI; 

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in the environment variables.");
  process.exit(1);
}

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("SHUBZ I VERSE Server running 🚀 ✅");
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`SHUBZ I VERSE Server is UP & RUNNING 🚀 ✅`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use((req, res) => {
  res.status(404).send("Route Not Found");
});