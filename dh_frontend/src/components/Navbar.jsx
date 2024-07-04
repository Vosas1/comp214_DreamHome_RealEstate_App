import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li> <Link to="/">Home</Link> </li>
        <li> <Link to="/staff">Staff</Link> </li>
        <li> <Link to="/clients">Clients</Link> </li>
        <li> <Link to="/properties">Properties</Link> </li>
        <li> <Link to="/leases">Leases</Link> </li>
        <li> <Link to="/registrations">Registrations</Link> </li>
        <li> <Link to="/privateowners">Private Owners</Link> </li>
      </ul>
    </nav>
  );
};

export default Navbar;
