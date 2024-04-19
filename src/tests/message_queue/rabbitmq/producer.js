const amqp = require('amqplib')
const messages = 'hello , rabbitmq!'

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true,
        })
        channel.sendToQueue(queueName, Buffer.from(messages))
        console.log('message sent: ', messages)
        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (e) {
        console.error(e)
    }
}

runProducer().catch((e) => console.error(e))
