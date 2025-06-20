import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0, // 0 for user, 1 for protectors, 2 for admin
      index: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const userModel = mongoose.model("users", userSchema);
