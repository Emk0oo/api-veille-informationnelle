const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const db = require("./config/db");
const authRoute = require("./routes/auth.route");
const port = process.env.API_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
