const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const cors = require('cors'); // Import cors


const propertyRouter = require('./property');
const staffRouter = require('./staff');
const branchRouter = require('./branch');
const clientRouter = require('./client');



const app = express();
app.use(express.json());
app.use(cors()); // Use cors


app.use('/api', clientRouter);
app.use('/api', propertyRouter);

app.use('/api', staffRouter);
app.use('/api', branchRouter);


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