// const { createClient } = require('redis')
// const {
//     redis: { host, port, username, password },
// } = require('./config')
// const { RedisError } = require('../core/error.response')

// let client = {},
//     statusConn = {
//         CONNECT: 'connect',
//         END: 'end',
//         RECONNECT: 'reconnecting',
//         ERROR: 'error',
//     }

// const REDIS_CONNECT_TIMEOUT = 10000,
//     REDIS_CONNECT_MESSAGE = {
//         code: -1,
//         message: 'Connect timed out',
//     }

// const handleRedisConnectTimeout = () => {
//     connectionTimeout = setTimeout(() => {
//         //create error response cho time out connect
//         throw new RedisError({
//             message: REDIS_CONNECT_MESSAGE.message,
//             statusCode: REDIS_CONNECT_MESSAGE.code,
//         })
//     }, REDIS_CONNECT_TIMEOUT)
// }

// const handleEventConnect = ({ connectionRedis }) => {
//     //check if null
//     connectionRedis.on(statusConn.CONNECT, () => {
//         console.log(`Redis - Connected Successfully`)
//         // clearTimeout(connectionTimeout)
//     })
//     connectionRedis.on(statusConn.END, () => {
//         console.log(`Redis - Disconnected`)
//         //reconnect
//         handleRedisConnectTimeout()
//     })
//     connectionRedis.on(statusConn.RECONNECT, () => {
//         console.log(`Redis - Reconnecting `)
//         clearTimeout(connectionTimeout)
//     })
//     connectionRedis.on(statusConn.ERROR, (err) => {
//         console.log(`Redis - Connect Error`, err)
//         handleRedisConnectTimeout()
//     })
// }

// const initRedis = () => {
//     const instance = createClient()

//     client.instanceConnect = instance
//     handleEventConnect({
//         connectionRedis: instance,
//     })
// }

// const getRedis = () => client

// const closeRedis = () => client.disconnect()

// module.exports = {
//     initRedis,
//     getRedis,
//     closeRedis,
// }

const { createClient } = require('redis')
const {
    redis: { host, port, username, password },
} = require('./config')
const { RedisError } = require('../core/error.response')

let client = {}
let connectionTimeout

const statusConn = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error',
}

const REDIS_CONNECT_TIMEOUT = 10000
const REDIS_CONNECT_MESSAGE = {
    code: -1,
    message: 'Connect timed out',
}

const handleRedisConnectTimeout = () => {
    connectionTimeout = setTimeout(() => {
        // create error response for connect timeout
        throw new RedisError({
            message: REDIS_CONNECT_MESSAGE.message,
            statusCode: REDIS_CONNECT_MESSAGE.code,
        })
    }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnect = ({ connectionRedis }) => {
    connectionRedis.on(statusConn.CONNECT, () => {
        console.log('Redis - Connected Successfully')
        clearTimeout(connectionTimeout)
    })
    connectionRedis.on(statusConn.END, () => {
        console.log('Redis - Disconnected')
        // reconnect
        handleRedisConnectTimeout()
    })
    connectionRedis.on(statusConn.RECONNECT, () => {
        console.log('Redis - Reconnecting')
        clearTimeout(connectionTimeout)
    })
    connectionRedis.on(statusConn.ERROR, (err) => {
        console.log('Redis - Connect Error', err)
        handleRedisConnectTimeout()
    })
}

const initRedis = () => {
    const instance = createClient()

    client.instanceConnect = instance
    handleEventConnect({ connectionRedis: instance })

    handleRedisConnectTimeout() // Start timeout handling

    instance.connect().catch((err) => {
        console.error('Redis - Connection failed:', err)
    })
}

const getRedis = () => client.instanceConnect

const closeRedis = async () => {
    if (client.instanceConnect) {
        await client.instanceConnect.quit()
        console.log('Redis - Connection closed')
    }
}

module.exports = {
    initRedis,
    getRedis,
    closeRedis,
}
