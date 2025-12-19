import { Router } from "express";
import {
  login,
  sendOTP,
  verifyOTP,
  sendMagicLink,
  resetPassword,
} from "../controllers/auth.controller.js";
const router = Router();

router.post("/login", login);
router.post("/forgot-password/otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password/magic-link", sendMagicLink);
router.post("/reset-password", resetPassword);

export default router;
