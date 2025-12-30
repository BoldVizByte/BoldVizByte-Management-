import React, { useEffect, useState } from "react";
import "../styles/users.css";
import { getUsers, addUser, deleteUser } from "../apiService";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  useEffect(() => {
  const loadUsers = async () => {
    try {
      const { data } = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  loadUsers();
}, []);

  const handleAddUser = async () => {
    if (!newUserName || !newUserEmail) {
      alert("Please enter name and email");
      return;
    }

    try {
      const { data } = await addUser({
        name: newUserName,
        email: newUserEmail,
      });

      setUsers((prev) => [...prev, data]);
      setNewUserName("");
      setNewUserEmail("");
    } catch (err) {
      console.error("Add user failed", err);
    }
  };


  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };


  return (
    <div className="users-page-container">
      <h1>Users Management</h1>

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
        <button onClick={handleAddUser}>Add User</button>
      </div>

      {/* Users Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
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
          ))}

        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
