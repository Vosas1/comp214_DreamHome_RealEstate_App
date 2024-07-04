const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const cors = require('cors'); // Import cors

const clientRouter = require('./client');
const propertyRouter = require('./property');
const leaseRouter = require('./lease');
const viewingRouter = require('./viewing');
const registrationRouter = require('./registration');
const staffRouter = require('./staff');
const branchRouter = require('./branch');
const privateOwnerRouter = require('./privateowner');
const propertyForRentRouter = require('./propertyforrent');

const app = express();
app.use(express.json());
app.use(cors()); // Use cors

app.use('/api', clientRouter);
app.use('/api', propertyRouter);
app.use('/api', leaseRouter);
app.use('/api', viewingRouter);
app.use('/api', registrationRouter);
app.use('/api', staffRouter);
app.use('/api', branchRouter);
app.use('/api', privateOwnerRouter);
app.use('/api', propertyForRentRouter);

async function run() {
  try {
    await oracledb.getConnection(dbConfig);
    console.log('Connected to Oracle Database');
  } catch (err) {
    console.error(err);
  }
}

run();

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});