import React, { useEffect, useState } from 'react';

const StaffListUpdate = () => {
  const [staff, setStaff] = useState([]);
  const [editedStaff, setEditedStaff] = useState({});

  useEffect(() => {
    // Fetch staff data from the API
    fetch('/api/staff')
      .then((response) => response.json())
      .then((data) => setStaff(data))
      .catch((error) => console.error('Error fetching staff:', error));
  }, []);

  const handleChange = (staffno, field, value) => {
    setEditedStaff({
      ...editedStaff,
      [staffno]: {
        ...editedStaff[staffno],
        [field]: value,
      },
    });
  };

  const handleSave = (staffno) => {
    const updatedData = editedStaff[staffno];

    fetch(`/api/staff/${staffno}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (response.ok) {
          alert('Staff updated successfully');
          // Update the staff list with the new data
          setStaff(staff.map((item) =>
            item.STAFFNO === staffno ? { ...item, ...updatedData } : item
          ));
          setEditedStaff((prevState) => {
            const newState = { ...prevState };
            delete newState[staffno];
            return newState;
          });
        } else {
          alert('Error updating staff');
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className="container">
      <h2>Update Staff Information</h2>
      <table className="staff-table">
        <thead>
          <tr>
            <th>Staff No</th>
            <th>Name</th>
            <th>Position</th>
            <th>Salary</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((item) => (
            <tr key={item.STAFFNO}>
              <td>{item.STAFFNO}</td>
              <td>{item.FNAME} {item.LNAME}</td>
              <td>{item.POSITION}</td>
              <td>
                <input
                  type="number"
                  value={editedStaff[item.STAFFNO]?.salary || item.SALARY}
                  onChange={(e) => handleChange(item.STAFFNO, 'salary', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={editedStaff[item.STAFFNO]?.telephone || item.TELEPHONE}
                  onChange={(e) => handleChange(item.STAFFNO, 'telephone', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="email"
                  value={editedStaff[item.STAFFNO]?.email || item.EMAIL}
                  onChange={(e) => handleChange(item.STAFFNO, 'email', e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => handleSave(item.STAFFNO)}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffListUpdate;
