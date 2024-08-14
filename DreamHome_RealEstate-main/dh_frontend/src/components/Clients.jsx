import React, { useState, useEffect } from 'react';

function Clients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterPrefType, setFilterPrefType] = useState('');
  const [newClient, setNewClient] = useState({
    clientno: '',
    fname: '',
    lname: '',
    telno: '',
    street: '',
    city: '',
    email: '',
    preftype: '',
    maxrent: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchTerm, filterCity, filterPrefType]);

  const fetchClients = () => {
    fetch('http://localhost:3001/api/clients')
      .then(response => response.json())
      .then(data => {
        setClients(data);
        setFilteredClients(data);
      })
      .catch(error => console.error('Error fetching clients:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({
      ...newClient,
      [name]: value
    });
  };

  const handleSearchAndFilter = () => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client =>
        `${client[1]} ${client[2]}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCity) {
      filtered = filtered.filter(client => client[5] === filterCity);
    }

    if (filterPrefType) {
      filtered = filtered.filter(client => client[7] === filterPrefType);
    }

    setFilteredClients(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `http://localhost:3001/api/clients/${newClient.clientno}`
      : 'http://localhost:3001/api/clients';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newClient)
    })
      .then(response => {
        if (response.ok) {
          return response.json(); // Return JSON response
        } else {
          return response.text().then(errorData => {
            throw new Error(errorData || 'Unknown error occurred');
          });
        }
      })
      .then((data) => {
        if (isEditing) {
          setClients(clients.map(client => (client[0] === newClient.clientno ? data : client)));
          setIsEditing(false);
        } else {
          setClients([...clients, data]); // Add new client to the clients array
        }
        setNewClient({
          clientno: '',
          fname: '',
          lname: '',
          telno: '',
          street: '',
          city: '',
          email: '',
          preftype: '',
          maxrent: ''
        });
        fetchClients(); // Refetch data after submit
      })
      .catch(error => {
        setErrorMessage('Error creating/updating client: ' + error.message);
        console.error('Error creating/updating client:', error);
      });
  };

  const handleEdit = (client) => {
    setNewClient({
      clientno: client[0],
      fname: client[1],
      lname: client[2],
      telno: client[3],
      street: client[4],
      city: client[5],
      email: client[6],
      preftype: client[7],
      maxrent: client[8]
    });
    setIsEditing(true);
  };

  const handleDelete = (clientno) => {
    fetch(`http://localhost:3001/api/clients/${clientno}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setClients(clients.filter(client => client[0] !== clientno));
          setFilteredClients(clients.filter(client => client[0] !== clientno));
        } else {
          return response.text().then(errorData => {
            throw new Error(errorData || 'Failed to delete client');
          });
        }
      })
      .catch(error => console.error('Error deleting client:', error));
  };

  return (
    <div>
      <h2>Clients</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div>
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select onChange={e => setFilterCity(e.target.value)} value={filterCity}>
          <option value="">All Cities</option>
          {Array.from(new Set(clients.map(client => client[5]))).map(city => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select onChange={e => setFilterPrefType(e.target.value)} value={filterPrefType}>
          <option value="">All Property Types</option>
          {Array.from(new Set(clients.map(client => client[7]))).map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {filteredClients.map(client => (
          <li key={client[0]}>
            {client[1]} {client[2]} - {client[3]} - {client[4]}, {client[5]}
            <button onClick={() => handleEdit(client)}>Edit</button>
            <button onClick={() => handleDelete(client[0])}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>{isEditing ? 'Edit Client' : 'Add a New Client'}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="clientno"
          placeholder="Client Number"
          value={newClient.clientno}
          onChange={handleInputChange}
          readOnly={isEditing} // Client number should not be edited while updating
        />
        <input
          type="text"
          name="fname"
          placeholder="First Name"
          value={newClient.fname}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="lname"
          placeholder="Last Name"
          value={newClient.lname}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="telno"
          placeholder="Telephone"
          value={newClient.telno}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={newClient.street}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={newClient.city}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={newClient.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="preftype"
          placeholder="Preferred Type"
          value={newClient.preftype}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="maxrent"
          placeholder="Max Rent"
          value={newClient.maxrent}
          onChange={handleInputChange}
        />
        <button type="submit">{isEditing ? 'Update Client' : 'Add Client'}</button>
      </form>
    </div>
  );
}

export default Clients;
