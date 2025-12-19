import dotenv from "dotenv";
dotenv.config(); // ✅ MUST be the very first thing

import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

console.log("DEBUG ENV CHECK:", {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });
