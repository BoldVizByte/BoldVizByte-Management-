import React, { useEffect, useState } from "react";
import "../styles/users.css";
import { getUsers, addUser, deleteUser } from "../apiService";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  // 🔹 Load users safely
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const res = await getUsers();

        // ✅ SAFETY: handle all response shapes
        const usersList = Array.isArray(res.data)
          ? res.data
          : res.data?.users || res.data?.data || [];

        setUsers(usersList);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError("Failed to load users");
        setUsers([]); // always array
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // 🔹 Add user
  const handleAddUser = async () => {
  setError("");

  if (!newUserName || !newUserEmail || !newUserPassword) {
    setError("Please enter name, email and password");
    return;
  }
  if (newUserPassword.length < 8) {
  setError("Password must be at least 8 characters");
  return;
}
  try {
    const res = await addUser({
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword, // ✅ THIS WAS MISSING
    });

    const createdUser = res.data?.data || res.data;

    setUsers((prev) => [...prev, createdUser]);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
  } catch (err) {
    console.error("Add user failed", err);
    setError(err.response?.data?.message || "Failed to add user");
  }
};


  // 🔹 Delete user
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete user");
    }
  };

  return (
    <div className="users-page-container">
      <div className="users-card">
      <h1>Users Management</h1>

      {error && <p className="error-text">{error}</p>}

      {/* Add User Form */}
      <div className="add-user-form">
        <input
          type="text"
          placeholder="Name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUserPassword}
          onChange={(e) => setNewUserPassword(e.target.value)}
        />

        <button onClick={handleAddUser}>Add User</button>
      </div>

      {/* Users Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user._id || index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default UsersPage;
