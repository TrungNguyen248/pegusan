'use strict'

//xu ly flashcard them thu cong --> later
const moment = require('moment')
const { convert2ObjectId } = require('../utils')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { nextReviewDate } = require('../utils')
const deckModel = require('../models/decks.model')
const flcardModel = require('../models/flashcard.model')

const getFlashCardReview = async ({ user_id }) => {
    const listDecks = await deckModel
        .find({
            user: convert2ObjectId(user_id),
        })
        .lean()
    if (listDecks.length <= 0)
        throw new NotFoundError('Khong co thu muc on tap')
    let result = []
    const today = new Date()
    await Promise.all(
        listDecks.map(async (deck) => {
            const flReview = await flcardModel
                .find({
                    deck: deck._id,
                    reviewDate: { $lte: today },
                })
                .populate('vocab', '')
                .populate('kanji', '')
                .populate('grammar', '')
                .select('vocab grammar interval reviewDate')
            flReview.forEach((fl) => result.push(fl))
        })
    )

    return result
}

const getAllDeckByUserId = async ({ user_id }) => {
    const listDecks = await deckModel
        .find({
            user: convert2ObjectId(user_id),
        })
        .select('deck_title ')
        .lean()

    if (listDecks.length == 0)
        throw new NotFoundError('Bo suu tap flashcard trong!')

    return listDecks
}

const getAllFlCardByDeck = async ({ deck_id }) => {
    const foundDeck = await deckModel
        .findById(convert2ObjectId(deck_id))
        .select('deck_title -_id')
        .lean()

    if (!foundDeck) throw NotFoundError('Khong tim thay thu muc')
    const listFlcards = await flcardModel
        .find({
            deck: convert2ObjectId(deck_id),
        })
        .populate('vocab', '')
        .populate('kanji', '')
        .populate('grammar', '')
        .select('vocab grammar interval reviewDate')

    if (listFlcards.length == 0)
        throw new NotFoundError('Chua co tu nao duoc them!')

    return {
        flashcard: listFlcards,
        ...foundDeck,
    }
}

const createDeck = async ({ user_id, deck_title }) => {
    const deckExists = await deckModel
        .findOne({
            deck_title,
        })
        .lean()
    if (deckExists) throw new BadRequestError('deck already exists')

    const newDeck = await deckModel.create({
        user: convert2ObjectId(user_id),
        deck_title,
    })

    return newDeck
}

const addFlCardToDeck = async ({ deck_id, type, level = 1, ...bodyData }) => {
    const deckExists = await deckModel
        .findById(convert2ObjectId(deck_id))
        .lean()
    if (!deckExists) throw new NotFoundError('deck not found')

    const { date, interval } = nextReviewDate(level)

    if (type == 'vocab') {
        for (let key in bodyData.vocab) {
            await flcardModel.create({
                deck: convert2ObjectId(deck_id),
                vocab: convert2ObjectId(bodyData.vocab[key]),
                interval: interval,
                reviewDate: date,
            })
        }
    }

    return 1
}

const updateFlCard = async ({ flcard_id, level }) => {
    //check level = 0 remove from lít
    const flcardExists = await flcardModel.findById(convert2ObjectId(flcard_id))
    if (!flcardExists) throw new NotFoundError(`Flash Card not found`)

    if (level == 0) {
        await flcardModel.deleteOne({
            _id: convert2ObjectId(flcard_id),
        })

        //frontend xu ly xoa khoi object render thay vi goi lai api tai thoi diem do?
        return
    }

    const { date, interval } = nextReviewDate(level)

    flcardExists.reviewDate = date
    flcardExists.interval = interval
    await flcardExists.save()

    const result = await flcardModel
        .findById(convert2ObjectId(flcard_id))
        .populate('vocab', '')
        .populate('kanji', '')
        .populate('grammar', '')
        .select('vocab grammar interval reviewDate')
        .lean()
    return {
        ...result,
        reviewDate: moment(new Date(result.reviewDate)).format(),
    }
}

module.exports = {
    createDeck,
    addFlCardToDeck,
    updateFlCard,
    getAllDeckByUserId,
    getAllFlCardByDeck,
    getFlashCardReview,
}
