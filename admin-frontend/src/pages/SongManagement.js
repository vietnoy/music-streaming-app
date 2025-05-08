import React from 'react';

const SongManagement = () => (
  <div className="content">
    <h2>Song Management</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Song Name</th>
          <th>Artist</th>
          <th>Album</th>
          <th>Genre</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Shape of You</td>
          <td>Ed Sheeran</td>
          <td>Divide</td>
          <td>Pop</td>
          <td>
            <button>Edit</button>
            <button style={{ marginLeft: '10px', backgroundColor: 'crimson' }}>Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default SongManagement;
