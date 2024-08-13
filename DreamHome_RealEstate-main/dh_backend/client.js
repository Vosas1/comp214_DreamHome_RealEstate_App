const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const router = express.Router();

// Connect to the database
async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

// Create a new client
router.post('/clients', async (req, res) => {
  const { clientno, fname, lname, telno, street, city, email, preftype, maxrent } = req.body;
  try {
    const connection = await getConnection();
    const result = await connection.execute(
      `INSERT INTO DH_CLIENT (CLIENTNO, FNAME, LNAME, TELNO, STREET, CITY, EMAIL, PREFTYPE, MAXRENT)
       VALUES (:clientno, :fname, :lname, :telno, :street, :city, :email, :preftype, :maxrent)`,
      [clientno, fname, lname, telno, street, city, email, preftype, maxrent],
      { autoCommit: true }
    );

    // Return the newly created client
    const newClient = {
      clientno,
      fname,
      lname,
      telno,
      street,
      city,
      email,
      preftype,
      maxrent
    };

    res.status(201).json(newClient);
  } catch (err) {
    console.error('Error inserting data', err);
    res.status(500).send('Error inserting data');
  }
});

// Read all clients
router.get('/clients', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(`SELECT * FROM DH_CLIENT`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data', err);
    res.status(500).send('Error fetching data');
  }
});

// Update a client
router.put('/clients/:clientno', async (req, res) => {
  const { clientno } = req.params;
  const { fname, lname, telno, street, city, email, preftype, maxrent } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `UPDATE DH_CLIENT SET FNAME = :fname, LNAME = :lname, TELNO = :telno, STREET = :street, CITY = :city, EMAIL = :email, PREFTYPE = :preftype, MAXRENT = :maxrent
       WHERE CLIENTNO = :clientno`,
      [fname, lname, telno, street, city, email, preftype, maxrent, clientno],
      { autoCommit: true }
    );

    // Return the updated client
    const updatedClient = {
      clientno,
      fname,
      lname,
      telno,
      street,
      city,
      email,
      preftype,
      maxrent
    };

    res.status(200).json(updatedClient);
  } catch (err) {
    console.error('Error updating data', err);
    res.status(500).send('Error updating data');
  }
});

// Delete a client
router.delete('/clients/:clientno', async (req, res) => {
  const { clientno } = req.params;
  try {
    const connection = await getConnection();
    await connection.execute(
      `DELETE FROM DH_CLIENT WHERE CLIENTNO = :clientno`,
      [clientno],
      { autoCommit: true }
    );
    res.send('Client deleted successfully');
  } catch (err) {
    console.error('Error deleting data', err);
    res.status(500).send('Error deleting data');
  }
});

module.exports = router;
