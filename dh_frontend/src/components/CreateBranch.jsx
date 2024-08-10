import React, { useState } from 'react';

const CreateBranch = () => {
  const [formData, setFormData] = useState({
    branchno: '',
    street: '',
    city: '',
    postcode: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Branch created successfully');
        setFormData({ branchno: '', street: '', city: '', postcode: '' });
      } else {
        setMessage('Error creating branch');
      }
    } catch (error) {
      setMessage('Error creating branch');
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h2>Create New Branch</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Branch Number:
            <input
              type="text"
              name="branchno"
              value={formData.branchno}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Street:
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Postcode:
            <input
              type="text"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit">Create Branch</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateBranch;
