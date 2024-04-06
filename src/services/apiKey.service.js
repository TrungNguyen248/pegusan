"use strict";

/* const crypto = require("crypto"); */
const apiKeyModel = require("../models/apiKey.model");

const findById = async (key) => {
  //   const apiKey = await apiKeyModel.create({
  //     key: crypto.randomBytes(64).toString("hex"),
  //     permissions: ["0000"],
  //   });
  //   console.log(`apiKey::`, apiKey);
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findById,
};
