'use strict'

const keytokenModel = require('../models/keytoken.model')
const { Types } = require('mongoose')

class KeyTokenService {
    static createKeyToken = async ({
        userId,
        privateKey,
        publicKey,
        refreshToken,
    }) => {
        try {
            //lv 0
            // const tokens = await keytokenModel.create({
            //   user: userId,
            //   publicKey,
            //   privateKey,
            // });
            //return tokens ? tokens.publicKey : null;

            //lv 1
            const filter = { user: userId }
            const update = {
                publicKey,
                privateKey,
                refreshTokenUsed: [],
                refreshToken,
            }
            const options = { upsert: true, new: true }

            const tokens = await keytokenModel.findOneAndUpdate(
                filter,
                update,
                options
            )
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) })
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne(id)
    }

    static findByRefreshTokensUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken })
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken })
    }

    static deleteKeyByUserId = async (userId) => {
        return await keytokenModel.deleteOne({
            user: new Types.ObjectId(userId),
        })
    }
}

module.exports = KeyTokenService
