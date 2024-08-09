const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const router = express.Router();

// Connect to the database
async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

// Create a new branch
router.post('/branches', async (req, res) => {
  const { branchno, street, city, postcode } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO DH_BRANCH (BRANCHNO, STREET, CITY, POSTCODE)
       VALUES (:branchno, :street, :city, :postcode)`,
      { branchno, street, city, postcode },
      { autoCommit: true }
    );
    res.status(201).send('Branch created successfully');
  } catch (err) {
    console.error('Error inserting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error inserting data: ${err.message}`);
  }
});

// Read all branches
router.get('/branches', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(`SELECT * FROM DH_BRANCH`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error fetching data: ${err.message}`);
  }
});

// Update a branch
router.put('/branches/:branchno', async (req, res) => {
  const { branchno } = req.params;
  const { street, city, postcode } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `UPDATE DH_BRANCH SET STREET = :street, CITY = :city, POSTCODE = :postcode
       WHERE BRANCHNO = :branchno`,
      { street, city, postcode, branchno },
      { autoCommit: true }
    );
    res.send('Branch updated successfully');
  } catch (err) {
    console.error('Error updating data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error updating data: ${err.message}`);
  }
});

// Delete a branch
router.delete('/branches/:branchno', async (req, res) => {
  const { branchno } = req.params;
  try {
    const connection = await getConnection();
    await connection.execute(
      `DELETE FROM DH_BRANCH WHERE BRANCHNO = :branchno`,
      { branchno },
      { autoCommit: true }
    );
    res.send('Branch deleted successfully');
  } catch (err) {
    console.error('Error deleting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error deleting data: ${err.message}`);
  }
});

module.exports = router;
