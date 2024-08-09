const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const router = express.Router();

// Connect to the database
async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

// Create a new property for rent
router.post('/propertyforrent', async (req, res) => {
  const { propertyno, street, city, postcode, type, rooms, rent, ownerno, staffno, branchno, picture, floorplan } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO DH_PROPERTYFORRENT (PROPERTYNO, STREET, CITY, POSTCODE, TYPE, ROOMS, RENT, OWNERNO, STAFFNO, BRANCHNO, PICTURE, FLOORPLAN)
       VALUES (:propertyno, :street, :city, :postcode, :type, :rooms, :rent, :ownerno, :staffno, :branchno, :picture, :floorplan)`,
      { propertyno, street, city, postcode, type, rooms, rent, ownerno, staffno, branchno, picture, floorplan },
      { autoCommit: true }
    );
    res.status(201).send('Property for rent created successfully');
  } catch (err) {
    console.error('Error inserting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error inserting data: ${err.message}`);
  }
});

// Read all properties for rent
router.get('/propertyforrent', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(`SELECT * FROM DH_PROPERTYFORRENT`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error fetching data: ${err.message}`);
  }
});

// Update a property for rent
router.put('/propertyforrent/:propertyno', async (req, res) => {
  const { propertyno } = req.params;
  const { street, city, postcode, type, rooms, rent, ownerno, staffno, branchno, picture, floorplan } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `UPDATE DH_PROPERTYFORRENT SET STREET = :street, CITY = :city, POSTCODE = :postcode, TYPE = :type, ROOMS = :rooms, RENT = :rent,
       OWNERNO = :ownerno, STAFFNO = :staffno, BRANCHNO = :branchno, PICTURE = :picture, FLOORPLAN = :floorplan
       WHERE PROPERTYNO = :propertyno`,
      { street, city, postcode, type, rooms, rent, ownerno, staffno, branchno, picture, floorplan, propertyno },
      { autoCommit: true }
    );
    res.send('Property for rent updated successfully');
  } catch (err) {
    console.error('Error updating data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error updating data: ${err.message}`);
  }
});

// Delete a property for rent
router.delete('/propertyforrent/:propertyno', async (req, res) => {
  const { propertyno } = req.params;
  try {
    const connection = await getConnection();
    await connection.execute(
      `DELETE FROM DH_PROPERTYFORRENT WHERE PROPERTYNO = :propertyno`,
      { propertyno },
      { autoCommit: true }
    );
    res.send('Property for rent deleted successfully');
  } catch (err) {
    console.error('Error deleting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error deleting data: ${err.message}`);
  }
});

module.exports = router;
