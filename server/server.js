// server.js
const express = require('express');
const app = express();
const cors = require('cors');

const controller = require('./serverController')();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/', controller);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
