const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const bcrypt = require("bcrypt");
const users = require("../models");

var uuid4 = require("uuid4");

/*
 * call other imported services, or same service but different functions here if you need to
*/
require("dotenv").config();

const postUserLogin = async (req, res, next) => {
  const { username, password } = req.body;
  // Use your DB ORM logic here to find user and compare password
  var userArray = users.filter(i => i.username === username);

  if (userArray.length === 1) {
    const user = userArray[0];
    console.log(user);
    // I am using a simple array users which i made above
    if (
      username == user.username &&
      password ==
        user.password /* Use your password hash checking logic here !*/
    ) {
      //If all credentials are correct do this
      let token = jwt.sign(
        { username: user.username },
        process.env.SECRET_KEY,
        { expiresIn: 15 }
      ); // Sigining the token
      res.json({
        success: true,
        err: null,
        token
      });
    } else {
      res.status(401).json({
        sucecss: false,
        token: null,
        err: "Username or password is incorrect"
      });
    }
  } else {
    res.status(401).json({
      sucecss: false,
      token: null,
      err: "Username or password is incorrect"
    });
  }
};

const postSignUpUser = async (req, res, next) => {
  const { username, password } = req.body;
  // array of unique users
  usernames = users.map(i => {
    return i.username;
  });

  if (usernames.includes(username)) {
    res.status(401).json({ success: false, err: "Username already exists!" });
  } else {
    const userId = Math.max(...users.map(i => i.id)) + 1;
    users.push({ id: userId, username, password });
    console.log(`User created with id ${userId}`);
    console.log(users);
    res.status(202).json({ id: userId, username });
  }
};

module.exports = {
  postUserLogin,
  postSignUpUser
};
