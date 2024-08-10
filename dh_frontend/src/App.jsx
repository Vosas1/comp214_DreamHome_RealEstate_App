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
import BranchMain from './pages/BranchMain';
import IdentifyBranch from './components/IdentifyBranch';
import BranchListUpdate from './pages/BranchListUpdate';
import CreateBranch from './pages/CreateBranch';
import AddClient from './pages/AddClient';
import UpdateClient from './pages/UpdateClient';

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
            <Route path="/identify-branch" component={<IdentifyBranch />} />
            <Route path="/update-branch" element={<BranchListUpdate />} />
            <Route path="/branch-main" component={<BranchMain />} />
            <Route path="/create-branch" element={<CreateBranch />} />
            <Route path="/add-client" element={<AddClient />} />
            <Route path="/update-client/:clientno" element={<UpdateClient />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
