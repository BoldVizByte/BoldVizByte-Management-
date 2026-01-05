import User from "../models/usersModel.js";
import bcrypt from "bcryptjs";

// Create a new user
export async function createUser(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({
      message: "Name, email, and password are required",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(422).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: err.message });
  }
}

// ✅ Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
}

// ✅ Get user by ID
export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
}

// Update user
export async function updateUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const updateData = { name, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated", data: user });
  } catch (err) {
    res.status(500).json({
      message: "Error updating user",
      error: err.message,
    });
  }
}

// Delete user
export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting user",
      error: err.message,
    });
  }
}
