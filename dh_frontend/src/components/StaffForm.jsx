import React, { useState } from 'react';

const StaffForm = () => {
  const [formData, setFormData] = useState({
    staffno: '',
    fname: '',
    lname: '',
    position: '',
    sex: '',
    dob: '',
    salary: '',
    branchno: '',
    telephone: '',
    mobile: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Staff hired successfully');
        // Handle success
      } else {
        alert('Error hiring staff');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form Fields */}
    </form>
  );
};

export default StaffForm;
