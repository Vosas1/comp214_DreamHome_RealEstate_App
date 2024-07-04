import React, { useEffect, useState } from 'react';

const LeaseList = () => {
  const [leases, setLeases] = useState([]);

  useEffect(() => {
    fetch('/api/leases')
      .then((response) => response.json())
      .then((data) => setLeases(data))
      .catch((error) => console.error('Error fetching leases:', error));
  }, []);

  return (
    <div>
      <h2>Lease List</h2>
      <ul className="list">
        {leases.map((lease) => (
          <li className="list-item" key={lease.LEASENO}>
            {lease.CLIENTNO} - {lease.RENT_START} to {lease.RENT_FINISH}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaseList;
