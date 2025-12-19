import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },

    magicToken: {
      type: String,
    },
    magicTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
