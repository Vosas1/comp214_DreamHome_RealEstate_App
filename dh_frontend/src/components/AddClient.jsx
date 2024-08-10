import React, { useState } from 'react';

const AddClient = () => {
  const [formData, setFormData] = useState({
    clientno: '',
    fname: '',
    lname: '',
    address: '',
    telno: '',
    email: '',
    regdate: ''
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
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Client created successfully');
        setFormData({ clientno: '', fname: '', lname: '', address: '', telno: '', email: '', regdate: '' });
      } else {
        setMessage('Error creating client');
      }
    } catch (error) {
      setMessage('Error creating client');
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h2>Add New Client</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Client Number:
            <input
              type="text"
              name="clientno"
              value={formData.clientno}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            First Name:
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Last Name:
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Telephone:
            <input
              type="text"
              name="telno"
              value={formData.telno}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Registration Date:
            <input
              type="date"
              name="regdate"
              value={formData.regdate}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit">Add Client</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddClient;
