const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    userID: String,
    refreshToken: String
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "refreshTokens",
  refreshTokenSchema,
  "refreshTokens"
);
