const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const bcrypt = require("bcrypt");
const userModel = require("../models/Users");
const refreshTokenModel = require("../models/refreshTokens");
const argon2 = require("argon2");

var uuid4 = require("uuid4");

const signUpUser = async (username, password) => {
  // Find User
  const userQuery = await userModel.findOne({ username: username });
  if (userQuery) {
    throw new Error("User Already Exists!");
  }
  // Hash password and store in DB
  let hashedPassword = await bcrypt.hash(password, 3);
  const newUser = new userModel({ username, password: hashedPassword });
  // Store new refreshToken
  const newRefreshToken = new refreshTokenModel({
    userID: newUser._id,
    // Empty refresh token will be generated on login
    refreshToken: ""
  });
  await newRefreshToken.save();
  await newUser.save();
  console.log(`User created with id ${newUser.id}`);
  console.log(`RefreshToken created with id ${newRefreshToken._id}`);
  return { _id: newUser._id, username: username };
};

const loginUser = async (username, password) => {
  const userQuery = await userModel.findOne({ username: username });
  if (!userQuery) {
    throw new Error("User does not exists!");
  }

  let passwordComparisonResults = await bcrypt.compare(
    password,
    userQuery.password,
    null
  );

  if (!passwordComparisonResults) {
    throw new Error("Passwords do not match!");
  }

  let accessToken = jwt.sign(
    { _id: userQuery._id, username: userQuery.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: 15 }
  );

  let refreshToken = jwt.sign(
    { _id: userQuery._id, username: userQuery.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: 600000 }
  );

  console.log(`Creating new refresh token in DB for user ${userQuery._id}`);
  updatedRefreshToken = await refreshTokenModel.findOne({
    userID: userQuery._id
  });
  updatedRefreshToken.refreshToken = refreshToken;
  console.log("Saving refresh token in DB");
  await updatedRefreshToken.save();
  console.log("Save success!");

  return { accessToken, refreshToken };
};
const issueAccessToken = async refreshToken => {
  const refreshTokenQuery = await refreshTokenModel.findOne({ refreshToken });
  // Check if refreshToken is in body
  if (refreshToken == null) {
    throw new Error("Null refreshToken!");
  }
  // Check that the refreshToken is whitelisted
  if (!refreshTokenQuery) {
    throw new Error("Invalid refreshToken!");
  }

  payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  const accessToken = jwt.sign(
    {
      _id: payload._id,
      username: payload.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: 120 }
  );

  return accessToken;
};

const revokeRefreshToken = async refreshToken => {
  const refreshTokenToUpdate = await refreshTokenModel.findOne({
    refreshToken
  });

  if (!refreshTokenToUpdate) {
    throw new Error("refreshToken Does Not Exist!");
  }

  console.log(`refreshTokenToUpdate: ${refreshTokenToUpdate}`);
  refreshTokenToUpdate.refreshToken = "";
  await refreshTokenToUpdate.save();

  return {
    userID: refreshTokenToUpdate.userID,
    refreshToken: refreshTokenToUpdate.refreshToken
  };
};

module.exports = {
  signUpUser,
  loginUser,
  issueAccessToken,
  revokeRefreshToken
};
