import React, { useState, useEffect } from 'react';

function Branches() {
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchNumberSearchTerm, setBranchNumberSearchTerm] = useState(''); // New state for branch number search
  const [filterCity, setFilterCity] = useState('');
  const [newBranch, setNewBranch] = useState({
    branchno: '',
    street: '',
    city: '',
    postcode: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitButtonLabel, setSubmitButtonLabel] = useState('Add Branch');

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchTerm, filterCity, branchNumberSearchTerm]); // Added branchNumberSearchTerm as a dependency

  const fetchBranches = () => {
    fetch('http://localhost:3001/api/branches')
      .then(response => response.json())
      .then(data => {
        setBranches(data);
        setFilteredBranches(data);
      })
      .catch(error => console.error('Error fetching branches:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBranch({
      ...newBranch,
      [name]: value
    });
  };

  const handleSearchAndFilter = () => {
    let filtered = branches;

    if (searchTerm) {
      filtered = filtered.filter(branch =>
        branch[1].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCity) {
      filtered = filtered.filter(branch => branch[2] === filterCity);
    }

    if (branchNumberSearchTerm) {
      filtered = filtered.filter(branch =>
        branch[0].toLowerCase().includes(branchNumberSearchTerm.toLowerCase())
      );
    }

    setFilteredBranches(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `http://localhost:3001/api/branches/${newBranch.branchno}`
      : 'http://localhost:3001/api/branches';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBranch)
    })
      .then(response => {
        if (response.ok) {
          // Handle successful response
          if (isEditing) {
            setBranches(branches.map(branch => (branch[0] === newBranch.branchno ? newBranch : branch)));
            setIsEditing(false);
          } else {
            setBranches([...branches, newBranch]);
            setFilteredBranches([...branches, newBranch]);
            // Show success and reset form
            setSubmitButtonLabel('Success');
            setTimeout(() => setSubmitButtonLabel('Add Branch'), 2000);
            setNewBranch({
              branchno: '',
              street: '',
              city: '',
              postcode: ''
            });
            fetchBranches(); // Refresh the list
          }
        } else {
          // Handle non-successful responses
          return response.text().then(errorData => {
            throw new Error(errorData || 'Unknown error occurred');
          });
        }
      })
      .catch(error => {
        if (error.message.includes('ORA-00001')) {
          setErrorMessage('A branch with this branch number already exists. Please use a unique branch number.');
        } else {
          setErrorMessage('Error creating/updating branch: ' + error.message);
        }
        console.error('Error creating/updating branch:', error);
      });
  };

  const handleEdit = (branch) => {
    setNewBranch(branch);
    setIsEditing(true);
  };

  const handleDelete = (branchno) => {
    fetch(`http://localhost:3001/api/branches/${branchno}`, {
      method: 'DELETE',
    })
      .then(() => {
        setBranches(branches.filter(branch => branch[0] !== branchno));
        setFilteredBranches(branches.filter(branch => branch[0] !== branchno));
      })
      .catch(error => console.error('Error deleting branch:', error));
  };

  return (
    <div>
      <h2>Branches</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div>
        <input
          type="text"
          placeholder="Search by Street"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Branch Number"
          value={branchNumberSearchTerm}
          onChange={e => setBranchNumberSearchTerm(e.target.value)}
        />
        <select onChange={e => setFilterCity(e.target.value)} value={filterCity}>
          <option value="">All Cities</option>
          {Array.from(new Set(branches.map(branch => branch[2]))).map(city => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {filteredBranches.map(branch => (
          <li key={branch[0]}>
            {branch[1]}, {branch[2]} - {branch[3]}
            <button onClick={() => handleEdit(branch)}>Edit</button>
            <button onClick={() => handleDelete(branch[0])}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>{isEditing ? 'Edit Branch' : 'Add a New Branch'}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="branchno"
          placeholder="Branch Number"
          value={newBranch.branchno}
          onChange={handleInputChange}
          readOnly={isEditing} // Branch number should not be edited while updating
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={newBranch.street}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={newBranch.city}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="postcode"
          placeholder="Postcode"
          value={newBranch.postcode}
          onChange={handleInputChange}
        />
        <button type="submit">{submitButtonLabel}</button>
      </form>
    </div>
  );
}

export default Branches;
