const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.API_PORT;
const db = require("./config/db");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
