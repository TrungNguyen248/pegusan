'use strict'

const { Types, model, Schema } = require('mongoose') // Erase if already required

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

//EXAM-001: new exam create
//EXAM-002: end time of exam
//COURSE-001: new course created
//....

// Declare the Schema of the Mongo model
const notificationSchema = new Schema(
    {
        noti_type: {
            type: String,
            enum: ['EXAM-001', 'EXAM-002', 'COURSE-001'],
            required: true,
        },
        noti_senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        noti_receivedId: {
            type: Number, //TEST
            required: true,
        },
        noti_content: {
            type: String,
            required: true,
        },
        noti_options: {
            type: Object,
            default: {},
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

//Export the model
module.exports = model(DOCUMENT_NAME, notificationSchema)
