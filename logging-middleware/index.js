const express = require('express');
const Log = require('./logger');

const app = express();
app.use(express.json());

app.get('/test', async (req, res) => {
  try {
    throw new Error("received string, expected bool");
  } catch (err) {
    await Log("backend", "error", "handler", err.message);
    res.status(500).send("Error was logged");
  }
});

app.listen(3000, () => {
  console.log(" Server is running on http://localhost:3000");
});
