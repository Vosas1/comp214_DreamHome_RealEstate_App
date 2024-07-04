import React, { useEffect, useState } from 'react';

const StaffList = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetch('/api/staff')
      .then((response) => response.json())
      .then((data) => setStaff(data))
      .catch((error) => console.error('Error fetching staff:', error));
  }, []);

  return (
    <div>
      <h2>Staff List</h2>
      <ul className="list">
        {staff.map((staffMember) => (
          <li className="list-item" key={staffMember.STAFFNO}>
            {staffMember.FNAME} {staffMember.LNAME} - {staffMember.POSITION}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StaffList;
