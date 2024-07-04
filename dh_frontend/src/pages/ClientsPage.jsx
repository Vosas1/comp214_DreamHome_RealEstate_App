import React from 'react';
import ClientsList from '../components/ClientsList';

const ClientsPage = () => {
  return (
    <div className="container">
      <h1 className="page-title">Clients Page</h1>
      <ClientsList />
    </div>
  );
};

export default ClientsPage;