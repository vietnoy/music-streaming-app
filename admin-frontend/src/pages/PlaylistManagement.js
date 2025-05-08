import React from 'react';

const PlaylistManagement = () => (
  <div className="content">
    <h2>Playlist Management</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Playlist Name</th>
          <th>Creator</th>
          <th>Number of Songs</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Top 100</td>
          <td>Admin</td>
          <td>100</td>
          <td><button>Edit</button><button style={{ marginLeft: '10px' }}>Delete</button></td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default PlaylistManagement;
