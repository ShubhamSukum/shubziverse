import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

import dotenv from "dotenv";
dotenv.config();

const userRouter = express.Router();

userRouter.post("/create", async (req, res) => {
  try {
    const { username, password } = req.body;
    const search = await userModel.findOne({ username });

    if (search == null) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await userModel.create({
        username,
        password: hashedPassword,
      });
      await newUser.save();

      return res.status(201).json({
        message: "User created successfully",
        success: true,
      });
    } else {
      return res.json({ message: "Username Already Exist!!", success: false });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please sign up.",
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Incorrect password. Please try again.",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token, userId: user._id, success: true });
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
});

export { userRouter };