import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const BranchesPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchNumberSearchTerm, setBranchNumberSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filteredBranches, setFilteredBranches] = useState([]); // Assuming branches is already fetched and set somewhere

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  // This function would be called every time the search/filter inputs change
  const handleSearchAndFilter = () => {
    let filtered = branches;

    if (searchTerm) {
      filtered = filtered.filter(branch =>
        branch[1].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCity) {
      filtered = filtered.filter(branch => branch[2] === filterCity);
    }

    if (branchNumberSearchTerm) {
      filtered = filtered.filter(branch =>
        branch[0].toLowerCase().includes(branchNumberSearchTerm.toLowerCase())
      );
    }

    setFilteredBranches(filtered);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Branches</h1>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by Street"
          className="form-control"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            handleSearchAndFilter();
          }}
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by Branch Number"
          className="form-control"
          value={branchNumberSearchTerm}
          onChange={e => {
            setBranchNumberSearchTerm(e.target.value);
            handleSearchAndFilter();
          }}
        />
      </div>

      <div className="row">
        {filteredBranches.map((branch, index) => (
          <div className="col-md-6" key={index}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{branch[1]}, {branch[2]}, {branch[3]}</h5>
                <Button variant="primary" onClick={handleShow}>
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Branch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form for editing branch details */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BranchesPage;
