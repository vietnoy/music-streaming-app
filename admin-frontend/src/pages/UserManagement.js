import React from 'react';

const UserManagement = () => (
  <div className="content">
    <h2>User Management</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>john_doe</td>
          <td>john@example.com</td>
          <td>User</td>
          <td>
            <button>Edit</button>
            <button style={{ marginLeft: '10px', backgroundColor: 'crimson' }}>Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default UserManagement;
