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
    const newBranch = { branchno, street, city, postcode };
    res.status(201).json(newBranch);
  } catch (err) {
    console.error('Error inserting data:', err.message);
    res.status(500).json({ error: `Error inserting data: ${err.message}` });
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
    res.status(500).json({ error: `Error fetching data: ${err.message}` });
  }
});

// Update a branch
router.put('/branches/:branchno', async (req, res) => {
  const { branchno } = req.params;
  const { street, city, postcode } = req.body;
  try {
    const connection = await getConnection();
    const result = await connection.execute(
      `UPDATE DH_BRANCH SET STREET = :street, CITY = :city, POSTCODE = :postcode
       WHERE BRANCHNO = :branchno`,
      { street, city, postcode, branchno },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      res.status(404).json({ error: 'Branch not found' });
    } else {
      const updatedBranch = { branchno, street, city, postcode };
      res.status(200).json(updatedBranch);
    }
  } catch (err) {
    console.error('Error updating data:', err.message);
    res.status(500).json({ error: `Error updating data: ${err.message}` });
  }
});

// Delete a branch
router.delete('/branches/:branchno', async (req, res) => {
  const { branchno } = req.params;
  try {
    const connection = await getConnection();
    const result = await connection.execute(
      `DELETE FROM DH_BRANCH WHERE BRANCHNO = :branchno`,
      { branchno },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      res.status(404).json({ error: 'Branch not found' });
    } else {
      res.json({ message: 'Branch deleted successfully' });
    }
  } catch (err) {
    console.error('Error deleting data:', err.message);
    res.status(500).json({ error: `Error deleting data: ${err.message}` });
  }
});

module.exports = router;
