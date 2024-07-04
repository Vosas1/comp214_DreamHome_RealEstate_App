import React, { useEffect, useState } from 'react';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch('/api/properties')
      .then((response) => response.json())
      .then((data) => setProperties(data))
      .catch((error) => console.error('Error fetching properties:', error));
  }, []);

  return (
    <div>
      <h2>Property List</h2>
      <ul className="list">
        {properties.map((property) => (
          <li className="list-item" key={property.PROPERTYNO}>
            {property.STREET}, {property.CITY} - {property.TYPE}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;
``

