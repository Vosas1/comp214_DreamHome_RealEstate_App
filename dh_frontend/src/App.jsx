import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StaffPage from './pages/StaffPage';
import ClientsPage from './pages/ClientsPage';
import PropertyPage from './pages/PropertyPage';
import LeasePage from './pages/LeasePage';
import RegistrationPage from './pages/RegistrationPage';
import PrivateOwnerPage from './pages/PrivateOwnerPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/properties" element={<PropertyPage />} />
            <Route path="/leases" element={<LeasePage />} />
            <Route path="/registrations" element={<RegistrationPage />} />
            <Route path="/privateowners" element={<PrivateOwnerPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
