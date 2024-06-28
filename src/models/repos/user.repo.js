'use strict'

const userModel = require('../user.model')

const createUser = async ({
    user_id,
    email,
    name,
    password,
    roles,
    user_slug,
}) => {
    const user = await userModel.create({
        user_id,
        email,
        name,
        password,
        roles,
        user_slug,
    })

    return user
}

module.exports = { createUser }
