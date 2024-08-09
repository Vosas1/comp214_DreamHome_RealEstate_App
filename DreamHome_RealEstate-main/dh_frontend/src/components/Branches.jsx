import React, { useState, useEffect } from 'react';

function Branches() {
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [newBranch, setNewBranch] = useState({
    branchno: '',
    street: '',
    city: '',
    postcode: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/branches')
      .then(response => response.json())
      .then(data => {
        setBranches(data);
        setFilteredBranches(data);
      })
      .catch(error => console.error('Error fetching branches:', error));
  }, []);

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchTerm, filterCity]);

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

    setFilteredBranches(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      .then(response => response.json())
      .then(data => {
        if (isEditing) {
          setBranches(branches.map(branch => (branch[0] === newBranch.branchno ? newBranch : branch)));
          setIsEditing(false);
        } else {
          setBranches([...branches, data]);
        }
        setFilteredBranches(branches);
        setNewBranch({
          branchno: '',
          street: '',
          city: '',
          postcode: ''
        });
      })
      .catch(error => console.error('Error creating/updating branch:', error));
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
      <div>
        <input
          type="text"
          placeholder="Search by Street"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
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
        <button type="submit">{isEditing ? 'Update Branch' : 'Add Branch'}</button>
      </form>
    </div>
  );
}

export default Branches;
