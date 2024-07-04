import React, { useEffect, useState } from 'react';

const RegistrationList = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetch('/api/registrations')
      .then((response) => response.json())
      .then((data) => setRegistrations(data))
      .catch((error) => console.error('Error fetching registrations:', error));
  }, []);

  return (
    <div>
      <h2>Registrations List</h2>
      <ul className="list">
        {registrations.map((registration) => (
          <li className="list-item" key={registration.REGNO}>
            {registration.CLIENTNO} - {registration.VIEWDATE}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegistrationList;

