'use strict'

const { SuccessResponse } = require('../core/success.response')

const dataProfiles = [
    { user_id: 1, user_name: 'nguyen', user_address: 'Nam dinh' },
    { user_id: 2, user_name: 'pegu', user_address: 'japanese' },
    { user_id: 3, user_name: 'successman', user_address: 'Every where' },
]

class ProfileController {
    //admin
    profiles = async (req, res, next) => {
        new SuccessResponse({
            message: 'view all profiles',
            metadata: dataProfiles,
        }).send(res)
    }

    //shop
    profile = async (req, res, next) => {
        new SuccessResponse({
            message: 'view own profiles',
            metadata: {
                user_id: 2,
                user_name: 'pegu',
                user_address: 'japanese',
            },
        }).send(res)
    }
}

module.exports = new ProfileController()
