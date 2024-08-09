const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const router = express.Router();

// Connect to the database
async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

// Create a new lease
router.post('/leases', async (req, res) => {
  const { leaseno, clientno, propertyno, leaseamount, lease_start, lease_end } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO DH_LEASE (LEASENO, CLIENTNO, PROPERTYNO, LEASEAMOUNT, LEASE_START, LEASE_END)
       VALUES (:leaseno, :clientno, :propertyno, :leaseamount, TO_DATE(:lease_start, 'YYYY-MM-DD'), TO_DATE(:lease_end, 'YYYY-MM-DD'))`,
      { leaseno, clientno, propertyno, leaseamount, lease_start, lease_end },
      { autoCommit: true }
    );
    res.status(201).send('Lease created successfully');
  } catch (err) {
    console.error('Error inserting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error inserting data: ${err.message}`);
  }
});

// Read all leases
router.get('/leases', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(`SELECT * FROM DH_LEASE`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error fetching data: ${err.message}`);
  }
});

// Update a lease
router.put('/leases/:leaseno', async (req, res) => {
  const { leaseno } = req.params;
  const { clientno, propertyno, leaseamount, lease_start, lease_end } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `UPDATE DH_LEASE SET CLIENTNO = :clientno, PROPERTYNO = :propertyno, LEASEAMOUNT = :leaseamount, LEASE_START = TO_DATE(:lease_start, 'YYYY-MM-DD'), LEASE_END = TO_DATE(:lease_end, 'YYYY-MM-DD')
       WHERE LEASENO = :leaseno`,
      { clientno, propertyno, leaseamount, lease_start, lease_end, leaseno },
      { autoCommit: true }
    );
    res.send('Lease updated successfully');
  } catch (err) {
    console.error('Error updating data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error updating data: ${err.message}`);
  }
});

// Delete a lease
router.delete('/leases/:leaseno', async (req, res) => {
  const { leaseno } = req.params;
  try {
    const connection = await getConnection();
    await connection.execute(
      `DELETE FROM DH_LEASE WHERE LEASENO = :leaseno`,
      { leaseno },
      { autoCommit: true }
    );
    res.send('Lease deleted successfully');
  } catch (err) {
    console.error('Error deleting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error deleting data: ${err.message}`);
  }
});

module.exports = router;
