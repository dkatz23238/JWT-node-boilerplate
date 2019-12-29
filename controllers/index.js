const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const bcrypt = require("bcrypt");
const userModel = require("../models/Users");
const refreshTokenModel = require("../models/refreshTokens");
const argon2 = require("argon2");

const services = require("../services");

var uuid4 = require("uuid4");

/*
 * call other imported services, or same service but different functions here if you need to
*/
require("dotenv").config();

const postUserLogin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Try to login user calling the service
    tokens = await services.loginUser(username, password);
    // Return access and refresh tokens
    return res.json({
      success: true,
      err: null,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (e) {
    // On failure return error
    return res.status(401).json({
      success: false,
      accessToken: null,
      err: e.message
    });
  }
};

const postSignUpUser = async (req, res, next) => {
  const { username, password } = req.body;
  // Find user from db
  try {
    newUser = await services.signUpUser(username, password);
    return res.status(202).json({
      success: true,
      err: null,
      _id: newUser._id,
      username
    });
  } catch (e) {
    res.status(401).json({ success: false, err: e.message });
  }
};

const postToken = async (req, res, next) => {
  console.log("postToken");
  // Get the refresh token from body
  const refreshToken = req.body.refreshToken;
  try {
    // Try to refresh token

    const accessToken = await services.issueAccessToken(refreshToken);

    return res.status(202).json({
      success: true,
      err: null,
      accessToken: accessToken
    });
  } catch (e) {
    // On error abort
    return res.status(403).json({ success: false, err: e.message });
  }
};

const postLogout = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  try {
    const revokedToken = await services.revokeRefreshToken(refreshToken);
    return res.status(202).json({
      success: true,
      err: null,
      invalidatedToken: refreshToken
    });
  } catch (e) {
    return res.status(403).json({ success: false, err: e.message });
  }
};

module.exports = {
  postUserLogin,
  postSignUpUser,
  postToken,
  postLogout
};
