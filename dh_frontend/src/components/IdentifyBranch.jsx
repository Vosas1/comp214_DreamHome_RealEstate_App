import React, { useState } from 'react';

const IdentifyBranch = () => {
  const [branchNo, setBranchNo] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAddress('');

    try {
      const response = await fetch(`/api/branch/${branchNo}`);
      if (response.ok) {
        const data = await response.json();
        setAddress(data.address);
      } else if (response.status === 404) {
        setError('Branch not found');
      } else {
        setError('Error retrieving branch address');
      }
    } catch (error) {
      setError('Error retrieving branch address');
    }
  };

  return (
    <div className="container">
      <h2>Identify Branch Address</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Branch Number:
          <input
            type="text"
            value={branchNo}
            onChange={(e) => setBranchNo(e.target.value)}
            required
          />
        </label>
        <button type="submit">Get Address</button>
      </form>
      {address && (
        <div className="address">
          <h3>Address:</h3>
          <p>{address}</p>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default IdentifyBranch;
