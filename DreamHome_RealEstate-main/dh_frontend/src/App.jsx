import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';

import Branches from './components/Branches';
import Clients from './components/Clients';
import Properties from './components/Properties';
import Staff from './components/Staff'; // Import Staff component

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/branches">Branches</Link></li>
            <li><Link to="/clients">Clients</Link></li>
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/staff">Staff</Link></li> {/* Add link to Staff */}
          </ul>
        </nav>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/staff" element={<Staff />} /> {/* Add route for Staff */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Welcome to Dream Home Estate</h2>;
}

export default App;