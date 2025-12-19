import User from "../models/usersModel.js";

// Create a new user
export async function createUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({
      message: "Validation failed",
      details: { name, email, password },
    });
  }

  try {
    const user = new User({ name, email, password });
    await user.save(); // Save to MongoDB
    res.status(201).json({ message: "User created", data: user });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
}

// Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find(); // Fetch from MongoDB
    res.json({ message: "All users", data: users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
}

// Get user by ID
export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: `User ${req.params.id}`, data: user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err });
  }
}

// Update user
export async function updateUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, password },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: `User ${req.params.id} updated`, data: user });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err });
  }
}

// Delete user
export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: `User ${req.params.id} deleted`, data: user });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err });
  }
}
