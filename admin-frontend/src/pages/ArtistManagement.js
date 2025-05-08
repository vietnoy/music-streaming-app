import React from 'react';

const ArtistManagement = () => (
  <div className="content">
    <h2>Artist Management</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Artist Name</th>
          <th>Bio</th>
          <th>Avatar</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Ed Sheeran</td>
          <td>English singer-songwriter</td>
          <td><img src="https://via.placeholder.com/40" alt="avatar" /></td>
          <td><button>Edit</button><button style={{ marginLeft: '10px' }}>Delete</button></td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default ArtistManagement;
