const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes");
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const errorHandler = require('./_helpers/error-handler');


require("dotenv").config();

// Instantiating the express-jwt middleware
const jwtMW = exjwt({
  secret: process.env.ACCESS_TOKEN_SECRET
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected…"))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", jwtMW /* Using the express jwt MW here */, (req, res) => {
  res.json({
    success: true,
    error: null,
    message: "You are authenticated"
  }); //Sending some response when authenticated
});
app.use("/", routes);

// Error handling
app.use(errorHandler);


app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);

module.exports = {
  app
};
