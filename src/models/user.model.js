'use strict'

const { Schema, model } = require('mongoose') // Erase if already required

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

// Declare the Schema of the Mongo model
const userSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            maxLength: 150,
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        salf: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['active', 'pending', 'block'],
            default: 'pending',
        },
        date_of_birth: {
            type: Date,
            default: null,
        },
        sex: {
            type: String,
            default: '',
        },
        avatar: {
            type: String,
            default: '',
        },
        roles: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
        },
        phone: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema)
