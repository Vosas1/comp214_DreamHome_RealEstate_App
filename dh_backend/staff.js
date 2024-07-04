const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const router = express.Router();

// Connect to the database
async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

// Create a new staff member
router.post('/staff', async (req, res) => {
  const { staffno, fname, lname, position, sex, dob, salary, branchno, telephone, mobile, email } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO DH_STAFF (STAFFNO, FNAME, LNAME, POSITION, SEX, DOB, SALARY, BRANCHNO, TELEPHONE, MOBILE, EMAIL)
       VALUES (:staffno, :fname, :lname, :position, :sex, TO_DATE(:dob, 'YYYY-MM-DD'), :salary, :branchno, :telephone, :mobile, :email)`,
      { staffno, fname, lname, position, sex, dob, salary, branchno, telephone, mobile, email },
      { autoCommit: true }
    );
    res.status(201).send('Staff member created successfully');
  } catch (err) {
    console.error('Error inserting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error inserting data: ${err.message}`);
  }
});

// Read all staff members
router.get('/staff', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(`SELECT * FROM DH_STAFF`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error fetching data: ${err.message}`);
  }
});

// Update a staff member
router.put('/staff/:staffno', async (req, res) => {
  const { staffno } = req.params;
  const { fname, lname, position, sex, dob, salary, branchno, telephone, mobile, email } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `UPDATE DH_STAFF SET FNAME = :fname, LNAME = :lname, POSITION = :position, SEX = :sex, DOB = TO_DATE(:dob, 'YYYY-MM-DD'),
       SALARY = :salary, BRANCHNO = :branchno, TELEPHONE = :telephone, MOBILE = :mobile, EMAIL = :email
       WHERE STAFFNO = :staffno`,
      { fname, lname, position, sex, dob, salary, branchno, telephone, mobile, email, staffno },
      { autoCommit: true }
    );
    res.send('Staff member updated successfully');
  } catch (err) {
    console.error('Error updating data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error updating data: ${err.message}`);
  }
});

// Delete a staff member
router.delete('/staff/:staffno', async (req, res) => {
  const { staffno } = req.params;
  try {
    const connection = await getConnection();
    await connection.execute(
      `DELETE FROM DH_STAFF WHERE STAFFNO = :staffno`,
      { staffno },
      { autoCommit: true }
    );
    res.send('Staff member deleted successfully');
  } catch (err) {
    console.error('Error deleting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).send(`Error deleting data: ${err.message}`);
  }
});

module.exports = router;

