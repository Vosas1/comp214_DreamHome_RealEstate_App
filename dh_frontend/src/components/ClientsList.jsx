import React, { useEffect, useState } from 'react';

const ClientsList = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch('/api/clients')
      .then((response) => response.json())
      .then((data) => setClients(data))
      .catch((error) => console.error('Error fetching clients:', error));
  }, []);

  return (
    <div>
      <h2>Clients List</h2>
      <ul className="list">
        {clients.map((client) => (
          <li className="list-item" key={client.CLIENTNO}>
            {client.FNAME} {client.LNAME} - {client.TELNO}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientsList;

