import React, { useState, useEffect } from 'react';

const UpdateClient = ({ clientno }) => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    address: '',
    telno: '',
    email: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch client data to populate the form
    fetch(`/api/clients/${clientno}`)
      .then((response) => response.json())
      .then((data) => {
        setFormData({
          fname: data.FNAME,
          lname: data.LNAME,
          address: data.ADDRESS,
          telno: data.TELNO,
          email: data.EMAIL
        });
      })
      .catch((error) => console.error('Error fetching client data:', error));
  }, [clientno]);

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
      const response = await fetch(`/api/clients/${clientno}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Client updated successfully');
      } else {
        setMessage('Error updating client');
      }
    } catch (error) {
      setMessage('Error updating client');
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h2>Update Client</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Update Client</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateClient;
