const { roleList } = require('../services/rbac.service')
const roleListName = 'app_permissions'
const { getRedis } = require('../configs/config.redis')

const redisClient = getRedis()

const appPermissions = async () => {
    const rolesList = await roleList({ userId: 9999 }) //

    await redisClient.set(roleListName, JSON.stringify(rolesList))
}

module.exports = {
    appPermissions,
}
