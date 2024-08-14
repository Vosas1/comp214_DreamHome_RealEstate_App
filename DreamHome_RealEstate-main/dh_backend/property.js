const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const router = express.Router();

// Connect to the database
async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

// Create a new property
router.post('/properties', async (req, res) => {
  const { propertyno, street, city, postcode, type, rooms, rent, ownerno, staffno, branchno, picture, floorplan } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO DH_PROPERTYFORRENT (PROPERTYNO, STREET, CITY, POSTCODE, TYPE, ROOMS, RENT, OWNERNO, STAFFNO, BRANCHNO, PICTURE, FLOORPLAN)
       VALUES (:propertyno, :street, :city, :postcode, :type, :rooms, :rent, :ownerno, :staffno, :branchno, :picture, :floorplan)`,
      { propertyno, street, city, postcode, type, rooms, rent, ownerno, staffno, branchno, picture, floorplan },
      { autoCommit: true }
    );

    const newProperty = { propertyno, street, city, postcode, type, rooms, rent, ownerno, staffno, branchno, picture, floorplan };
    res.status(201).json(newProperty);
  } catch (err) {
    if (err.message.includes('ORA-02291')) {  // Foreign key constraint error
      res.status(400).json({ error: 'Failed to insert property: Owner number does not exist. Please provide a valid owner number.' });
    } else {
      console.error('Error inserting data:', err.message);
      res.status(500).json({ error: `Error inserting data: ${err.message}` });
    }
  }
});

// Read all properties
router.get('/properties', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(`SELECT * FROM DH_PROPERTYFORRENT`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.status(500).json({ error: `Error fetching data: ${err.message}` });
  }
});

// Update a property
router.put('/properties/:propertyno', async (req, res) => {
  const { propertyno } = req.params;
  const { street, city, postcode, type, rooms, rent, ownerno, staffno, branchno, picture, floorplan } = req.body;
  
  try {
    const connection = await getConnection();
    const result = await connection.execute(
      `UPDATE DH_PROPERTYFORRENT SET STREET = :street, CITY = :city, POSTCODE = :postcode, TYPE = :type, ROOMS = :rooms, RENT = :rent, OWNERNO = :ownerno, STAFFNO = :staffno, BRANCHNO = :branchno, PICTURE = :picture, FLOORPLAN = :floorplan
       WHERE PROPERTYNO = :propertyno`,
      { street, city, postcode, type, rooms, rent, ownerno, staffno, branchno, picture, floorplan, propertyno },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      res.status(404).json({ error: 'Property not found' });
    } else {
      const updatedProperty = { propertyno, street, city, postcode, type, rooms, rent, ownerno, staffno, branchno, picture, floorplan };
      res.status(200).json(updatedProperty);
    }
  } catch (err) {
    console.error('Error updating data:', err.message);
    res.status(500).json({ error: `Error updating data: ${err.message}` });
  }
});

// Delete a property
router.delete('/properties/:propertyno', async (req, res) => {
  const { propertyno } = req.params;
  
  try {
    const connection = await getConnection();
    const result = await connection.execute(
      `DELETE FROM DH_PROPERTYFORRENT WHERE PROPERTYNO = :propertyno`,
      { propertyno },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      res.status(404).json({ error: 'Property not found' });
    } else {
      res.json({ message: 'Property deleted successfully' });
    }
  } catch (err) {
    console.error('Error deleting data:', err.message);
    res.status(500).json({ error: `Error deleting data: ${err.message}` });
  }
});

module.exports = router;
