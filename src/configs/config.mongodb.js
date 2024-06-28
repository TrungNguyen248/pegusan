'use strict'

const mongoose = require('mongoose')
const {
    db: { host, name, port },
} = require('./config')
const { countConnect } = require('../helpers/check.connect')
const MAX_POLL_SIZE = 50
const TIME_OUT_CONNECT = 3000

const connectString = `mongodb://${host}:${port}/${name}`

//console.log(connectString);
// prettier-ignore
class Database {
    constructor() {
        this.connect()
    }

    //connect
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }

        mongoose
            .connect(connectString, {
                serverSelectionTimeoutMS: TIME_OUT_CONNECT,
                maxPoolSize: MAX_POLL_SIZE,
            })
            .then((_) => {
                try {
                    countConnect()
                } catch (e) {
                    console.log(e)
                }
        
                console.log(`Connect mongoDb success!`)
            })
            .catch((err) => console.log(`Error Connect!`))
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb
