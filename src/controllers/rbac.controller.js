'use strict'

const { SuccessResponse } = require('../core/success.response')
const {
    createResource,
    createRole,
    roleList,
    resourceList,
} = require('../services/rbac.service')

/**
 * @desc Create a new role
 * @param {string} name
 * @param {*} res
 * @param {*} next
 */
const newRole = async (req, res, next) => {
    new SuccessResponse({
        message: 'created role successfully',
        metadata: await createRole(req.body),
    }).send(res)
}

const newResource = async (req, res, next) => {
    new SuccessResponse({
        message: 'created resource successfully',
        metadata: await createResource(req.body),
    }).send(res)
}

const roleLists = async (req, res, next) => {
    new SuccessResponse({
        message: 'get list role successfully',
        metadata: await roleList(req.query),
    }).send(res)
}

const resourceLists = async (req, res, next) => {
    new SuccessResponse({
        message: 'get list resource successfully',
        metadata: await resourceList(req.query),
    }).send(res)
}

module.exports = {
    newRole,
    newResource,
    roleLists,
    resourceLists,
}
