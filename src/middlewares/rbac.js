'use strict'

const AccessControl = require('accesscontrol')
const { AuthFailureError } = require('../core/error.response')
const { roleList } = require('../services/rbac.service')
const { getRedis } = require('../configs/config.redis')
const redisClient = getRedis()

const rbac = new AccessControl()

/**
 * @param {string} action // read, delete, or update
 * @param {*} resource // profile, manager_dashboard
 */

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            //console.log(`granted access:::::`, req.user)
            const roleListName = 'app_permissions'
            const rolesList = await redisClient.get(roleListName)
            if (!rolesList || rolesList == null) {
                rbac.setGrants(await roleList({ userId: 99999 }))
            } else {
                rbac.setGrants(JSON.parse(rolesList))
            }

            const rol_name = req.user.role //check role name tra ve tu router
            const permission = rbac.can(rol_name)[action](resource)

            if (!permission.granted) {
                throw new AuthFailureError('you dont have this permission')
            }
            next()
        } catch (err) {
            next(err)
        }
    }
}

module.exports = {
    grantAccess,
}
