'use strict'

const { ForbiddenError } = require('../core/error.response')

class AccessValidator {
    static validateLoginRequest(loginRequest) {
        // check email
        if (!loginRequest.email || loginRequest.email.length < 8) {
            throw new ForbiddenError('Email invalid')
        }
        // check password
        if (!loginRequest.password) {
            throw new ForbiddenError('Password invalid')
        }
    }

    static validateRegister(registerRequest) {
        // check name
        if (!registerRequest.name || registerRequest.name.length < 5) {
            throw new ForbiddenError('Name invalid')
        }
        // check email
        if (!registerRequest.email || registerRequest.email.length < 8) {
            throw new ForbiddenError('Email invalid')
        }
        // check password
        if (!registerRequest.password || registerRequest.password.length < 6) {
            throw new ForbiddenError('Password invalid')
        }
        // check msisdn
        // if (!registerRequest.msisdn || registerRequest.msisdn.length < 10) {
        //     throw new ForbiddenError('Msisdn invalid')
        // }
    }
}

module.exports = AccessValidator
