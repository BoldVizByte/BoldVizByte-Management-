import express from "express";
import * as usersController from "../controllers/usersController.js";
import * as usersValidator from "../validators/usersValidator.js";

const router = express.Router();

// ✅ Simple test route to verify it's working
router.get("/test", (req, res) => {
  res.json({ message: "Users route is working!" });
});

// Get all users
router.get("/", usersController.getAllUsers);

// Create a new user
router.post("/", ...usersValidator.createUserRules, usersController.createUser);

// Get user by ID
router.get("/:id", ...usersValidator.idParamRule, usersController.getUserById);

// Update user
router.put("/:id", ...usersValidator.idParamRule, ...usersValidator.createUserRules, usersController.updateUser);

// Delete user
router.delete("/:id", ...usersValidator.idParamRule, usersController.deleteUser);

export default router;