const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const bcrypt = require("bcrypt");

const router = express.Router();
const controllers = require("../controllers");

router.post("/login", controllers.postUserLogin);
router.post("/signup", controllers.postSignUpUser);

module.exports = router;
