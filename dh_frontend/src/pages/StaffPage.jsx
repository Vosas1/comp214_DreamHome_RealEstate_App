import React, { useState } from 'react';
import StaffList from '../components/StaffList';
import StaffForm from '../components/StaffForm';  // Import the StaffForm component

const StaffPage = () => {
  const [showForm, setShowForm] = useState(false);  // State to control form visibility

  const toggleForm = () => {
    setShowForm(!showForm);  // Toggle form visibility
  };

  return (
    <div className="container">
      <h1 className="page-title">Staff Page</h1>
      
      {/* Button to toggle the visibility of the Staff Hiring Form */}
      <button onClick={toggleForm}>
        {showForm ? 'Hide Staff Hiring Form' : 'Show Staff Hiring Form'}
      </button>
      
      {/* Conditionally render the StaffForm based on showForm state */}
      {showForm && <StaffForm />}

      {/* List of staff members */}
      <StaffList />
      <StaffListUpdate /> 
    </div>
  );
};

export default StaffPage;
