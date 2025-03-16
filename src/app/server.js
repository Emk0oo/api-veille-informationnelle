const express = require("express");
const app = express();
const dotenv = require("dotenv");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
dotenv.config();
const db = require("./config/db");
const verifyToken = require("./middleware/verifyTokenValidity");
const authRoute = require("./routes/auth.route");
const rssFeedsRoute = require("./routes/rssFeeds.route");
const subscriptionRoute = require("./routes/subscriptions.route");
const rssFeedService = require("./services/rssFeeds.service");

const port = process.env.API_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoute);
app.use(verifyToken);
app.use("/api/rssFeeds", rssFeedsRoute);
app.use("/api/subscriptions", subscriptionRoute);



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
