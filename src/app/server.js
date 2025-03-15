const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.API_PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
