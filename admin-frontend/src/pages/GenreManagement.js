import React from 'react';

const GenreManagement = () => (
  <div className="content">
    <h2>Genre Management</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Genre Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Pop</td>
          <td>Popular music genre</td>
          <td><button>Edit</button><button style={{ marginLeft: '10px' }}>Delete</button></td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default GenreManagement;
