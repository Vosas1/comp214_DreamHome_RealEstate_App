const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const router = express.Router();

// Connect to the database
async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

// Create a new registration
router.post('/registrations', async (req, res) => {
  const { clientno, branchno, staffno, dateregister } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO DH_REGISTRATION (CLIENTNO, BRANCHNO, STAFFNO, DATEREGISTER)
       VALUES (:clientno, :branchno, :staffno, TO_DATE(:dateregister, 'YYYY-MM-DD'))`,
      { clientno, branchno, staffno, dateregister },
      { autoCommit: true }
    );
    res.status(201).send('Registration created successfully');
  } catch (err) {
    console.error('Error inserting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error inserting data: ${err.message}`);
  }
});

// Read all registrations
router.get('/registrations', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(`SELECT * FROM DH_REGISTRATION`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error fetching data: ${err.message}`);
  }
});

// Update a registration
router.put('/registrations/:clientno/:branchno/:staffno', async (req, res) => {
  const { clientno, branchno, staffno } = req.params;
  const { dateregister } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `UPDATE DH_REGISTRATION SET DATEREGISTER = TO_DATE(:dateregister, 'YYYY-MM-DD')
       WHERE CLIENTNO = :clientno AND BRANCHNO = :branchno AND STAFFNO = :staffno`,
      { dateregister, clientno, branchno, staffno },
      { autoCommit: true }
    );
    res.send('Registration updated successfully');
  } catch (err) {
    console.error('Error updating data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error updating data: ${err.message}`);
  }
});

// Delete a registration
router.delete('/registrations/:clientno/:branchno/:staffno', async (req, res) => {
  const { clientno, branchno, staffno } = req.params;
  try {
    const connection = await getConnection();
    await connection.execute(
      `DELETE FROM DH_REGISTRATION WHERE CLIENTNO = :clientno AND BRANCHNO = :branchno AND STAFFNO = :staffno`,
      { clientno, branchno, staffno },
      { autoCommit: true }
    );
    res.send('Registration deleted successfully');
  } catch (err) {
    console.error('Error deleting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error deleting data: ${err.message}`);
  }
});

module.exports = router;
