import React from 'react';

const AlbumManagement = () => (
  <div className="content">
    <h2>Album Management</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Album Name</th>
          <th>Description</th>
          <th>Cover</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Divide</td>
          <td>Ed Sheeran's 3rd studio album</td>
          <td><img src="https://via.placeholder.com/40" alt="cover" /></td>
          <td><button>Edit</button><button style={{ marginLeft: '10px' }}>Delete</button></td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default AlbumManagement;
