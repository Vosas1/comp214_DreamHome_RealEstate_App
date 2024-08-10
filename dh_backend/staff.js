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
  let updateFields = [];
  let updateValues = {};
  if (fname !== undefined) {
    updateFields.push("FNAME = :fname");
    updateValues.fname = fname;
  }
  if (lname !== undefined) {
    updateFields.push("LNAME = :lname");
    updateValues.lname = lname;
  }
  if (position !== undefined) {
    updateFields.push("POSITION = :position");
    updateValues.position = position;
  }
  if (sex !== undefined) {
    updateFields.push("SEX = :sex");
    updateValues.sex = sex;
  }
  if (dob !== undefined) {
    updateFields.push("DOB = TO_DATE(:dob, 'YYYY-MM-DD')");
    updateValues.dob = dob;
  }
  if (salary !== undefined) {
    updateFields.push("SALARY = :salary");
    updateValues.salary = salary;
  }
  if (branchno !== undefined) {
    updateFields.push("BRANCHNO = :branchno");
    updateValues.branchno = branchno;
  }
  if (telephone !== undefined) {
    updateFields.push("TELEPHONE = :telephone");
    updateValues.telephone = telephone;
  }
  if (mobile !== undefined) {
    updateFields.push("MOBILE = :mobile");
    updateValues.mobile = mobile;
  }
  if (email !== undefined) {
    updateFields.push("EMAIL = :email");
    updateValues.email = email;
  }
  updateValues.staffno = staffno;
  const updateQuery = `UPDATE DH_STAFF SET ${updateFields.join(", ")} WHERE STAFFNO = :staffno`;
  try {
    const connection = await getConnection();
    await connection.execute(updateQuery, updateValues, { autoCommit: true });
    res.send('Staff member updated successfully');
  } catch (err) {
    console.error('Error updating data:', err.message);
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

