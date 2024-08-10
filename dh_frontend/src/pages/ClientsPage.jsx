import React from 'react';
import ClientsList from '../components/ClientsList';

const ClientsPage = () => {
  return (
    <div className="container">
      <h1 className="page-title">Clients Page</h1>
      <ClientsList />
      <li><Link to="/add-client">Add New Client</Link></li>
      <li><Link to="/update-client/:clientno">Update Client</Link></li>
    </div>
  );
};

export default ClientsPage;