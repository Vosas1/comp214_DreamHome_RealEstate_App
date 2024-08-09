const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const router = express.Router();

// Connect to the database
async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

// Create a new viewing
router.post('/viewings', async (req, res) => {
  const { clientno, propertyno, viewdate, comments } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO DH_VIEWING (CLIENTNO, PROPERTYNO, VIEWDATE, COMMENTS)
       VALUES (:clientno, :propertyno, TO_DATE(:viewdate, 'YYYY-MM-DD'), :comments)`,
      { clientno, propertyno, viewdate, comments },
      { autoCommit: true }
    );
    res.status(201).send('Viewing created successfully');
  } catch (err) {
    console.error('Error inserting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error inserting data: ${err.message}`);
  }
});

// Read all viewings
router.get('/viewings', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(`SELECT * FROM DH_VIEWING`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error fetching data: ${err.message}`);
  }
});

// Update a viewing
router.put('/viewings/:clientno/:propertyno', async (req, res) => {
  const { clientno, propertyno } = req.params;
  const { viewdate, comments } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `UPDATE DH_VIEWING SET VIEWDATE = TO_DATE(:viewdate, 'YYYY-MM-DD'), COMMENTS = :comments
       WHERE CLIENTNO = :clientno AND PROPERTYNO = :propertyno`,
      { viewdate, comments, clientno, propertyno },
      { autoCommit: true }
    );
    res.send('Viewing updated successfully');
  } catch (err) {
    console.error('Error updating data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error updating data: ${err.message}`);
  }
});

// Delete a viewing
router.delete('/viewings/:clientno/:propertyno', async (req, res) => {
  const { clientno, propertyno } = req.params;
  try {
    const connection = await getConnection();
    await connection.execute(
      `DELETE FROM DH_VIEWING WHERE CLIENTNO = :clientno AND PROPERTYNO = :propertyno`,
      { clientno, propertyno },
      { autoCommit: true }
    );
    res.send('Viewing deleted successfully');
  } catch (err) {
    console.error('Error deleting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error deleting data: ${err.message}`);
  }
});

module.exports = router;
