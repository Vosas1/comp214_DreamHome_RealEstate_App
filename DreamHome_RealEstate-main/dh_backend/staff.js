const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const router = express.Router();

// Connect to the database
async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

// Add a staff
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

    // Return the newly created staff member
    const newStaff = { staffno, fname, lname, position, sex, dob, salary, branchno, telephone, mobile, email };
    res.status(201).json(newStaff);
  } catch (err) {
    console.error('Error inserting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).json({ error: `Error inserting data: ${err.message}` });
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
    res.status(500).json({ error: `Error fetching data: ${err.message}` });
  }
});

router.put('/staff/:staffno', async (req, res) => {
  const { staffno } = req.params;
  const { fname, lname, position, sex, dob, salary, branchno, telephone, mobile, email } = req.body;

  // Ensure dob is in the correct format (YYYY-MM-DD)
  let formattedDob = dob.split('T')[0];  // Extract the date part only (YYYY-MM-DD)

  try {
    const connection = await getConnection();
    await connection.execute(
      `UPDATE DH_STAFF SET 
         FNAME = :fname, 
         LNAME = :lname, 
         POSITION = :position, 
         SEX = :sex, 
         DOB = TO_DATE(:dob, 'YYYY-MM-DD'), 
         SALARY = :salary, 
         BRANCHNO = :branchno, 
         TELEPHONE = :telephone, 
         MOBILE = :mobile, 
         EMAIL = :email
       WHERE STAFFNO = :staffno`,
      { fname, lname, position, sex, dob: formattedDob, salary, branchno, telephone, mobile, email, staffno },
      { autoCommit: true }
    );
    res.json({ message: 'Staff member updated successfully' });
  } catch (err) {
    console.error('Error updating data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).json({ error: `Error updating data: ${err.message}` });
  }
});



// Update all staff members
router.put('/staff', async (req, res) => {
  const { fname, lname, position, sex, dob, salary, branchno, telephone, mobile, email } = req.body;
  const updates = {};

  if (fname) updates.FNAME = fname;
  if (lname) updates.LNAME = lname;
  if (position) updates.POSITION = position;
  if (sex) updates.SEX = sex;
  if (dob) updates.DOB = `TO_DATE('${dob}', 'YYYY-MM-DD')`; // Ensure date format is correct
  if (salary) updates.SALARY = salary;
  if (branchno) updates.BRANCHNO = branchno;
  if (telephone) updates.TELEPHONE = telephone;
  if (mobile) updates.MOBILE = mobile;
  if (email) updates.EMAIL = email;

  // Construct the SQL update statement dynamically based on provided fields
  let updateQuery = 'UPDATE DH_STAFF SET ';
  const updateKeys = Object.keys(updates);
  updateQuery += updateKeys.map((key, index) => `${key} = :${key}`).join(', ');

  try {
    const connection = await getConnection();
    await connection.execute(
      updateQuery,
      updates,
      { autoCommit: true }
    );
    res.json({ message: 'All staff members updated successfully' });
  } catch (err) {
    console.error('Error updating data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).json({ error: `Error updating data: ${err.message}` });
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
    res.json({ message: 'Staff member deleted successfully' });
  } catch (err) {
    console.error('Error deleting data:', err.message);
    console.error('Stack Trace:', err.stack);
    res.status(500).json({ error: `Error deleting data: ${err.message}` });
  }
});

module.exports = router;
