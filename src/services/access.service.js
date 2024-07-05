'use strict'

const userModel = require('../models/user.model')
const pointModel = require('../models/point.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { parseBypoint } = require('../utils/level_up.util')
const {
    BadRequestError,
    AuthFailureError,
    ForbiddenError,
    NotFoundError,
} = require('../core/error.response')
const AccessValidator = require('../validators/access.validator')
// const { createUserRedis } = require('../utils/redis.util')
const roleModel = require('../models/role.model')
const progressModel = require('../models/progress.model')

// thay bang truy van tu database docs role
const RoleApp = {
    ADMIN: 'admin',
    USER: 'user',
    TEACHER: 'teacher',
    // TEST_CREATOR: 'test_crt',
    // COURSE_CREATOR: 'course_crt',
}

class AccessService {
    static handlerRefreshToken = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new ForbiddenError('Something wrong happend!!pls relogin')
        }

        if (keyStore.refreshToken !== refreshToken)
            throw new AuthFailureError('User not registered!')

        const userExist = await userModel.findOne({ email }).lean()

        if (!userExist) throw new AuthFailureError('User not registered!')

        //create 1 cap token
        const tokens = await createTokenPair(
            { userId, email },
            keyStore.publicKey,
            keyStore.privateKey
        )

        //update token
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken,
            },
        })

        return {
            user,
            tokens,
        }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)

        console.log(delKey)
        return delKey
    }

    /*
    1-Check email
    2-match password
    3-create AT vs RT and save
    4-generate tokens
    5-get data return login
  */
    static login = async ({ email, password, refreshToken = null }) => {
        //validate login
        AccessValidator.validateLoginRequest({ email, password })

        //1-Check email
        const userExist = await userModel
            .findOne({ email })
            .populate('roles', 'rol_name -_id')
        if (!userExist) throw new NotFoundError('Tài khoản chưa đăng kí.')
        //2-match password
        const match = await bcrypt.compare(password, userExist.password)
        if (!match) throw new AuthFailureError('Mật khẩu không đúng.')

        const user_point = await pointModel
            .findOne({
                user: userExist._id,
            })
            .lean()
        const levelDetail = parseBypoint(user_point.total_point)

        //3-create AT vs RT and save
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        //4-generate tokens
        const tokens = await createTokenPair(
            {
                userId: userExist._id,
                email,
                role: userExist.roles.rol_name,
                status: userExist.status,
            },
            publicKey,
            privateKey
        )

        await KeyTokenService.createKeyToken({
            userId: userExist._id,
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
        })

        return {
            user: {
                ...getInfoData({
                    fields: ['_id', 'name', 'email', 'avatar'],
                    object: userExist,
                }),
                ...levelDetail,
            },
            tokens,
        }
    }

    static signUp = async ({ name, email, password }) => {
        //valdate register
        AccessValidator.validateRegister({ name, email, password })

        //1: check email exists
        const userExist = await userModel.findOne({ email }).lean()

        if (userExist) {
            throw new BadRequestError('User already registered!')
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const roleUser = await roleModel
            .findOne({
                rol_name: RoleApp.USER,
            })
            .lean()

        const newUser = await userModel.create({
            name,
            email,
            password: passwordHash,
            roles: roleUser._id, //user by default
        })
        if (newUser) {
            const publicKey = crypto.randomBytes(64).toString('hex')
            const privateKey = crypto.randomBytes(64).toString('hex')

            //console.log({ privateKey, publicKey })

            //save collection key
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newUser._id,
                publicKey,
                privateKey,
            })

            if (!keyStore) {
                throw new BadRequestError('Key store error')
            }

            //created token pair
            const tokens = await createTokenPair(
                {
                    userId: newUser._id,
                    email,
                    role: roleUser.rol_name,
                    status: newUser.status,
                },
                publicKey,
                privateKey
            )

            //console.log(`Created Token Success`, tokens)

            //create point user
            await pointModel.create({
                user: newUser._id,
                total_point: 0,
                weeklyScores: [],
            })

            await progressModel.create({
                user: newUser._id,
            })

            //create hash user redis
            // await createUserRedis({
            //     user_id: newUser._id,
            //     user_name: name,
            //     avatar: '',
            //     point: 0,
            // })

            return {
                user: {
                    ...getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: newUser,
                    }),
                    level: 1,
                },
                tokens,
            }
        }
        return {
            code: 200,
            metadata: null,
        }
    }
}

module.exports = AccessService
