import React, { useEffect, useState } from 'react';

const PrivateOwnerList = () => {
  const [privateOwners, setPrivateOwners] = useState([]);

  useEffect(() => {
    fetch('/api/privateowners')
      .then((response) => response.json())
      .then((data) => setPrivateOwners(data))
      .catch((error) => console.error('Error fetching private owners:', error));
  }, []);

  return (
    <div>
      <h2>Private Owners List</h2>
      <ul className="list">
        {privateOwners.map((owner) => (
          <li className="list-item" key={owner.OWNERNO}>
            {owner.FNAME} {owner.LNAME} - {owner.TELNO}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrivateOwnerList;