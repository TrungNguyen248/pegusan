'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
const {
    notification: {
        discord: { token, channelId },
    },
} = require('../configs/config')

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        })

        //add channel
        this.channelId = channelId

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}`)
        })

        this.client.login(token)
    }

    sendToFormatCode(logData) {
        const {
            code,
            message = 'Infor about code',
            title = ' Code example',
        } = logData

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16),
                    title,
                    description:
                        '```json\n' + JSON.stringify(code, null, 2) + '\n```',
                },
            ],
        }

        this.sendToMessage(codeMessage)
    }

    sendToMessage(message = 'message') {
        const channel = this.client.channels.cache.get(this.channelId)

        if (!channel) {
            console.error(`Couldn't find the channel ${this.channelId}`)
            return
        }

        channel.send(message).catch((e) => console.error(e))
    }
}

module.exports = new LoggerService()
