'use strict'

const amqp = require('amqplib')

async function consummerOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()

    const queueName = 'ordered-message-queue'
    await channel.assertQueue(queueName, {
        durable: true,
    })

    //set prefetch (1 per only 1 job)
    channel.prefetch(1)

    channel.consume(queueName, (msg) => {
        const message = msg.content.toString()
        setTimeout(() => {
            console.log('processed::', message)
            channel.ack(msg)
        }, Math.random() * 1000)
    })
}

consummerOrderedMessage().catch((e) => console.error(e))
