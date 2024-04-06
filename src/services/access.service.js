"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./user.service");

const RoleApp = {
  ADMIN: "admin",
  USER: "user",
  SUPPORTER: "supporter",
  TEST_CREATOR: "test_crt",
  COURSE_CREATOR: "course_crt",
};

class AccessService {
  static handlerRefreshToken = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError("Something wrong happend!!pls relogin");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("User not registered!");

    const userExist = await findByEmail({ email });

    if (!userExist) throw new AuthFailureError("User not registered!");

    //create 1 cap token
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    //update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);

    console.log(delKey);
    return delKey;
  };

  /*
    1-Check email
    2-match password
    3-create AT vs RT and save
    4-generate tokens
    5-get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    //1-Check email
    const userExist = await findByEmail({ email });
    if (!userExist) throw new BadRequestError("User not registered");
    //2-match password
    const match = bcrypt.compare(password, userExist.password);
    if (!match) throw new AuthFailureError("Authentication error");
    //3-create AT vs RT and save
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    //4-generate tokens
    const tokens = await createTokenPair(
      { userId: userExist._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: userExist._id,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      user: getInfoData({
        fields: ["_id", "name", "email"],
        object: userExist,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    //1: check email exists
    const userExist = await userModel.findOne({ email }).lean(); //lean giảm thiểu size query

    if (userExist) {
      throw new BadRequestError("Error: User already registered!");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleApp.USER],
    });

    if (newUser) {
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");

      console.log({ privateKey, publicKey });

      //save collection key
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Key store error");
      }

      //created token pair
      const tokens = await createTokenPair(
        { userId: newUser._id, email },
        publicKey,
        privateKey
      );

      console.log(`Created Token Success`, tokens);

      return {
        user: getInfoData({
          fields: ["_id", "name", "email"],
          object: newUser,
        }),
        tokens,
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
