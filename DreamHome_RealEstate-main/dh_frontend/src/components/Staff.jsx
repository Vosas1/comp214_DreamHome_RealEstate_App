import React, { useState, useEffect } from 'react';

function Staff() {
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({
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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = () => {
    fetch('http://localhost:3001/api/staff')
      .then(response => response.json())
      .then(data => setStaff(data))
      .catch(error => console.error('Error fetching staff:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({
      ...newStaff,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `http://localhost:3001/api/staff/${newStaff.staffno}`
      : 'http://localhost:3001/api/staff';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newStaff)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save data');
        }
        return response.json();
      })
      .then(data => {
        setNewStaff({
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
        setIsEditing(false);
        fetchStaffData(); // Refetch data after submit
      })
      .catch(error => console.error('Error creating/updating staff:', error));
  };

  const handleEdit = (member) => {
    setNewStaff(member);
    setIsEditing(true);
  };

  const handleDelete = (staffno) => {
    fetch(`http://localhost:3001/api/staff/${staffno}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete data');
        }
        fetchStaffData(); // Refetch data after delete
      })
      .catch(error => console.error('Error deleting staff:', error));
  };

  const handleUpdateAll = () => {
    const updatedFields = Object.fromEntries(
      Object.entries(newStaff).filter(([key, value]) => value !== null && value !== '')
    );
  
    fetch('http://localhost:3001/api/staff', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedFields)
    })
      .then(response => {
        if (response.ok) {
          alert('All staff members updated successfully');
          setNewStaff({
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
          fetchStaffData(); // Refetch data after updating all
        } else {
          return response.text().then(errorData => {
            throw new Error(errorData || 'Unknown error occurred');
          });
        }
      })
      .catch(error => console.error('Error updating all staff members:', error));
  };

  return (
    <div>
      <h2>Staff</h2>
      <ul>
        {staff.map(member => (
          <li key={member[0]}>
            {member[1]} {member[2]} - {member[3]} - {member[6]}
            <button onClick={() => handleEdit(member)}>Edit</button>
            <button onClick={() => handleDelete(member[0])}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>{isEditing ? 'Edit Staff Member' : 'Add a New Staff Member'}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="staffno"
          placeholder="Staff Number"
          value={newStaff.staffno}
          onChange={handleInputChange}
          readOnly={isEditing} // Staff number should not be edited while updating
        />
        <input
          type="text"
          name="fname"
          placeholder="First Name"
          value={newStaff.fname}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="lname"
          placeholder="Last Name"
          value={newStaff.lname}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={newStaff.position}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="sex"
          placeholder="Sex"
          value={newStaff.sex}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          value={newStaff.dob}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={newStaff.salary}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="branchno"
          placeholder="Branch Number"
          value={newStaff.branchno}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="telephone"
          placeholder="Telephone"
          value={newStaff.telephone}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={newStaff.mobile}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newStaff.email}
          onChange={handleInputChange}
        />
        <button type="submit">{isEditing ? 'Update Staff Member' : 'Add Staff Member'}</button>
        <button type="button" onClick={handleUpdateAll}>Update All Staff Members</button>
      </form>
    </div>
  );
}

export default Staff;
