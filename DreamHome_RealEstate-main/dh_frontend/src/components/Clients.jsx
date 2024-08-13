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

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    fetch('http://localhost:3001/api/clients')
      .then(response => response.json())
      .then(data => {
        setClients(data);
        setFilteredClients(data);
      })
      .catch(error => console.error('Error fetching clients:', error));
  };

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchTerm, filterCity, filterPrefType]);

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
        if (!response.ok) {
          throw new Error('Failed to save data');
        }
        return response.json();
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
      .catch(error => console.error('Error creating/updating client:', error));
  };

  const handleEdit = (client) => {
    setNewClient(client);
    setIsEditing(true);
  };

  const handleDelete = (clientno) => {
    fetch(`http://localhost:3001/api/clients/${clientno}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete data');
        }
        fetchClients(); // Refetch data after delete
      })
      .catch(error => console.error('Error deleting client:', error));
  };

  return (
    <div>
      <h2>Clients</h2>
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
