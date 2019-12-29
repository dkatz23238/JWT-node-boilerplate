const express = require("express");

const router = express.Router();
const controllers = require("../controllers");

// Handle User Login
router.post("/login", controllers.postUserLogin);

// Handle User Sign Up
router.post("/signup", controllers.postSignUpUser);

// Handle Refresh Tokens
router.post("/tokens", controllers.postToken);

// Handle Refresh Tokens
router.post("/logout", controllers.postLogout);

module.exports = router;
