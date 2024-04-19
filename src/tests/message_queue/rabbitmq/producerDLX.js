const amqp = require('amqplib')
const messages = 'hello , rabbitmq!'

const log = console.log
console.log = function () {
    log.apply(console, [new Date()].concat(arguments))
}

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()

        const notificationExchange = 'notificationEx' //notificationEX direct
        const notiQueue = 'notificationQueueProcess' //assertQueue
        const notificationExchangeDLX = 'notificationExDLX' //notificationEx direct
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' //assert

        //1. create Exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true,
        })

        //2. create Queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, // cho phep cac ket noi truy cap cung luc vao hang doi
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX,
        })

        //3. Bind queue
        await channel.bindQueue(queueResult.queue, notificationExchange)

        //4. Send notification
        const msg = 'new course'
        console.log('message:', msg)

        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000',
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (e) {
        console.error(e)
    }
}

runProducer().catch((e) => console.error(e))
