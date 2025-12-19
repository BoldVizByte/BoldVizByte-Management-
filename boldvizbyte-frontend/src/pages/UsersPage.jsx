import React, { useState } from "react";
import "../styles/users.css";
import { getUsers, addUser, deleteUser } from "../apiService";

const UsersPage = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Jones", email: "jones@example.com" },
    { id: 2, name: "Vincy", email: "vincy@example.com" },
  ]);

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  // Add user
  const handleAddUser = () => {
    if (newUserName && newUserEmail) {
      const newUser = {
        id: users.length + 1,
        name: newUserName,
        email: newUserEmail,
      };
      setUsers([...users, newUser]);
      setNewUserName("");
      setNewUserEmail("");
    } else {
      alert("Please enter name and email");
    }
  };

  // Delete user
  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
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
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user.id)}
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
