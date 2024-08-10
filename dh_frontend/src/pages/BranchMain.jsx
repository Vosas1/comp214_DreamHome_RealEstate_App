import React from 'react';
import { Link } from 'react-router-dom';

const BranchMain = () => {
  return (
    <div className="container">
      <h1>Branch Main Menu</h1>
      <ul>
        <li><Link to="/identify-branch">Identify Branch Address</Link></li>
        <li><Link to="/update-branch">Update Branch Details</Link></li>
        <li><Link to="/create-branch">Create New Branch</Link></li>
        {/* Add other branch-related links here */}
      </ul>
    </div>
  );
};

export default BranchMain;
