import React, { useState, useEffect } from 'react';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterRooms, setFilterRooms] = useState('');
  const [newProperty, setNewProperty] = useState({
    propertyno: '',
    street: '',
    city: '',
    postcode: '',
    type: '',
    rooms: '',
    rent: '',
    ownerno: '',
    staffno: '',
    branchno: '',
    picture: '',
    floorplan: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchTerm, filterCity, filterRooms]);

  const fetchProperties = () => {
    fetch('http://localhost:3001/api/properties')
      .then(response => response.json())
      .then(data => {
        setProperties(data);
        setFilteredProperties(data);
      })
      .catch(error => console.error('Error fetching properties:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty({
      ...newProperty,
      [name]: value
    });
  };

  const handleSearchAndFilter = () => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property[1].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCity) {
      filtered = filtered.filter(property => property[2] === filterCity);
    }

    if (filterRooms) {
      filtered = filtered.filter(property => property[5] === parseInt(filterRooms, 10));
    }

    setFilteredProperties(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `http://localhost:3001/api/properties/${newProperty.propertyno}`
      : 'http://localhost:3001/api/properties';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProperty)
    })
      .then(response => {
        if (response.ok) {
          return response.json(); // Return JSON response
        } else {
          return response.text().then(text => { throw new Error(text); });
        }
      })
      .then((data) => {
        if (isEditing) {
          setProperties(properties.map(property => (property[0] === newProperty.propertyno ? data : property)));
          setIsEditing(false);
        } else {
          setProperties([...properties, data]); // Add new property to the properties array
        }
        setFilteredProperties(properties);
        setNewProperty({
          propertyno: '',
          street: '',
          city: '',
          postcode: '',
          type: '',
          rooms: '',
          rent: '',
          ownerno: '',
          staffno: '',
          branchno: '',
          picture: '',
          floorplan: ''
        });
        fetchProperties(); // Refetch data after submit
      })
      .catch(error => {
        console.error('Error creating/updating property:', error);
        setErrorMessage('Error creating/updating property: ' + error.message);
      });
  };

  const handleEdit = (property) => {
    setNewProperty({
      propertyno: property[0],
      street: property[1],
      city: property[2],
      postcode: property[3],
      type: property[4],
      rooms: property[5],
      rent: property[6],
      ownerno: property[7],
      staffno: property[8],
      branchno: property[9],
      picture: property[10],
      floorplan: property[11]
    });
    setIsEditing(true);
  };

  const handleDelete = (propertyno) => {
    fetch(`http://localhost:3001/api/properties/${propertyno}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setProperties(properties.filter(property => property[0] !== propertyno));
          setFilteredProperties(properties.filter(property => property[0] !== propertyno));
        } else {
          return response.text().then(errorData => {
            throw new Error(errorData || 'Failed to delete property');
          });
        }
      })
      .catch(error => console.error('Error deleting property:', error));
  };

  return (
    <div>
      <h2>Properties</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div>
        <input
          type="text"
          placeholder="Search by Street"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select onChange={e => setFilterCity(e.target.value)} value={filterCity}>
          <option value="">All Cities</option>
          {Array.from(new Set(properties.map(property => property[2]))).map(city => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select onChange={e => setFilterRooms(e.target.value)} value={filterRooms}>
          <option value="">All Room Numbers</option>
          {Array.from(new Set(properties.map(property => property[5]))).map(rooms => (
            <option key={rooms} value={rooms}>
              {rooms} Rooms
            </option>
          ))}
        </select>
      </div>
      <ul>
        {filteredProperties.map(property => (
          <li key={property[0]}>
            {property[1]}, {property[2]} - {property[5]} rooms - ${property[6]} rent
            <button onClick={() => handleEdit(property)}>Edit</button>
            <button onClick={() => handleDelete(property[0])}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>{isEditing ? 'Edit Property' : 'Add a New Property'}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="propertyno"
          placeholder="Property Number"
          value={newProperty.propertyno}
          onChange={handleInputChange}
          readOnly={isEditing} // Property number should not be edited while updating
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={newProperty.street}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={newProperty.city}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="postcode"
          placeholder="Postcode"
          value={newProperty.postcode}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={newProperty.type}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="rooms"
          placeholder="Rooms"
          value={newProperty.rooms}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="rent"
          placeholder="Rent"
          value={newProperty.rent}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="ownerno"
          placeholder="Owner Number"
          value={newProperty.ownerno}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="staffno"
          placeholder="Staff Number"
          value={newProperty.staffno}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="branchno"
          placeholder="Branch Number"
          value={newProperty.branchno}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="picture"
          placeholder="Picture URL"
          value={newProperty.picture}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="floorplan"
          placeholder="Floor Plan URL"
          value={newProperty.floorplan}
          onChange={handleInputChange}
        />
        <button type="submit">{isEditing ? 'Update Property' : 'Add Property'}</button>
      </form>
    </div>
  );
}

export default Properties;
