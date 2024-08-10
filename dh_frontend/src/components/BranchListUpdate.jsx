import React, { useEffect, useState } from 'react';

const BranchListUpdate = () => {
  const [branches, setBranches] = useState([]);
  const [editedBranch, setEditedBranch] = useState({});

  useEffect(() => {
    // Fetch branch data from the API
    fetch('/api/branches')
      .then((response) => response.json())
      .then((data) => setBranches(data))
      .catch((error) => console.error('Error fetching branches:', error));
  }, []);

  const handleChange = (branchno, field, value) => {
    setEditedBranch({
      ...editedBranch,
      [branchno]: {
        ...editedBranch[branchno],
        [field]: value,
      },
    });
  };

  const handleSave = (branchno) => {
    const updatedData = editedBranch[branchno];

    fetch(`/api/branch/${branchno}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (response.ok) {
          alert('Branch updated successfully');
          // Update the branch list with the new data
          setBranches(branches.map((item) =>
            item.BRANCHNO === branchno ? { ...item, ...updatedData } : item
          ));
          setEditedBranch((prevState) => {
            const newState = { ...prevState };
            delete newState[branchno];
            return newState;
          });
        } else {
          alert('Error updating branch');
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className="container">
      <h2>Update Branch Details</h2>
      <table className="branch-table">
        <thead>
          <tr>
            <th>Branch No</th>
            <th>Street</th>
            <th>City</th>
            <th>Postcode</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((item) => (
            <tr key={item.BRANCHNO}>
              <td>{item.BRANCHNO}</td>
              <td>
                <input
                  type="text"
                  value={editedBranch[item.BRANCHNO]?.street || item.STREET}
                  onChange={(e) => handleChange(item.BRANCHNO, 'street', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={editedBranch[item.BRANCHNO]?.city || item.CITY}
                  onChange={(e) => handleChange(item.BRANCHNO, 'city', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={editedBranch[item.BRANCHNO]?.postcode || item.POSTCODE}
                  onChange={(e) => handleChange(item.BRANCHNO, 'postcode', e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => handleSave(item.BRANCHNO)}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BranchListUpdate;
