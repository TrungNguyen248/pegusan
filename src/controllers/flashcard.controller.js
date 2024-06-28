'use strict'

const {
    addFlCardToDeck,
    createDeck,
    updateFlCard,
    getAllDeckByUserId,
    getAllFlCardByDeck,
} = require('../services/flashcard.service')
const { SuccessResponse } = require('../core/success.response')

const getAllDeckByUserIdCtr = async (req, res, next) => {
    new SuccessResponse({
        message: 'get all deck by user successfully',
        metadata: await getAllDeckByUserId({
            user_id: req.user.userId,
        }),
    }).send(res)
}

const getAllFlCardByDeckCtr = async (req, res, next) => {
    new SuccessResponse({
        message: 'get all deck by user successfully',
        metadata: await getAllFlCardByDeck(req.body),
    }).send(res)
}

const createDeckCtr = async (req, res, next) => {
    new SuccessResponse({
        message: 'add deck successfully',
        metadata: await createDeck({
            user_id: req.user.userId,
            ...req.body,
        }),
    }).send(res)
}

const addFlCardToDeckCtr = async (req, res, next) => {
    new SuccessResponse({
        message: 'flcard add successfully',
        metadata: await addFlCardToDeck(req.body),
    }).send(res)
}

const updateFlCardCtr = async (req, res, next) => {
    new SuccessResponse({
        message: 'flcard updated successfully',
        metadata: await updateFlCard({
            flcard_id: req.params.flcard_id,
            ...req.body,
        }),
    }).send(res)
}

module.exports = {
    createDeckCtr,
    updateFlCardCtr,
    addFlCardToDeckCtr,
    getAllDeckByUserIdCtr,
    getAllFlCardByDeckCtr,
}
