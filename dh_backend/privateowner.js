const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const router = express.Router();

// Connect to the database
async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

// Create a new private owner
router.post('/privateowners', async (req, res) => {
  const { ownerno, fname, lname, telno, address, email, password } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO DH_PRIVATEOWNER (OWNERNO, FNAME, LNAME, TELNO, ADDRESS, EMAIL, PASSWORD)
       VALUES (:ownerno, :fname, :lname, :telno, :address, :email, :password)`,
      { ownerno, fname, lname, telno, address, email, password },
      { autoCommit: true }
    );
    res.status(201).send('Private owner created successfully');
  } catch (err) {
    console.error('Error inserting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error inserting data: ${err.message}`);
  }
});

// Read all private owners
router.get('/privateowners', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(`SELECT * FROM DH_PRIVATEOWNER`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error fetching data: ${err.message}`);
  }
});

// Update a private owner
router.put('/privateowners/:ownerno', async (req, res) => {
  const { ownerno } = req.params;
  const { fname, lname, telno, address, email, password } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `UPDATE DH_PRIVATEOWNER SET FNAME = :fname, LNAME = :lname, TELNO = :telno, ADDRESS = :address, EMAIL = :email, PASSWORD = :password
       WHERE OWNERNO = :ownerno`,
      { fname, lname, telno, address, email, password, ownerno },
      { autoCommit: true }
    );
    res.send('Private owner updated successfully');
  } catch (err) {
    console.error('Error updating data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error updating data: ${err.message}`);
  }
});

// Delete a private owner
router.delete('/privateowners/:ownerno', async (req, res) => {
  const { ownerno } = req.params;
  try {
    const connection = await getConnection();
    await connection.execute(
      `DELETE FROM DH_PRIVATEOWNER WHERE OWNERNO = :ownerno`,
      { ownerno },
      { autoCommit: true }
    );
    res.send('Private owner deleted successfully');
  } catch (err) {
    console.error('Error deleting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error deleting data: ${err.message}`);
  }
});

module.exports = router;
