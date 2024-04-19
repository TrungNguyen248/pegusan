'use strict'

const amqp = require('amqplib')

async function consummerOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()

    const queueName = 'ordered-message-queue'
    await channel.assertQueue(queueName, {
        durable: true,
    })

    for (let i = 0; i < 10; i++) {
        const message = `ordered-message-queue ${i}`
        console.log(message)
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true,
        })
    }

    setTimeout(() => {
        connection.close()
    }, 1000)
}

consummerOrderedMessage().catch((e) => console.error(e))
