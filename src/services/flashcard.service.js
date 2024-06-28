'use strict'

//xu ly flashcard them thu cong --> later
const moment = require('moment')
const { convert2ObjectId } = require('../utils')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { nextReviewDate } = require('../utils')
const deckModel = require('../models/decks.model')
const flcardModel = require('../models/flashcard.model')

const getAllDeckByUserId = async ({ user_id }) => {
    console.log('////////////////////////////////', user_id)
    const listDecks = await deckModel
        .find({
            user: convert2ObjectId(user_id),
        })
        .lean()

    if (listDecks.length == 0)
        throw new NotFoundError('Bo suu tap flashcard trong!')

    return listDecks
}

const getAllFlCardByDeck = async ({ deck_id }) => {
    const listFlcards = await flcardModel.find({
        deck: convert2ObjectId(deck_id),
    })
    if (listFlcards.length == 0)
        throw new NotFoundError('Chua co tu nao duoc them!')

    return listFlcards
}

const createDeck = async ({ user_id, deck_title }) => {
    //console.log('////////////////////////////////', user_id)

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

const addFlCardToDeck = async ({ deck_id, level, ...bodyData }) => {
    const deckExists = await deckModel
        .findById(convert2ObjectId(deck_id))
        .lean()
    if (!deckExists) throw new NotFoundError('deck not found')

    const { date, interval } = nextReviewDate(level)
    if (bodyData.vocab_id && bodyData.vocab_id != '') {
        bodyData = {
            ...bodyData,
            vocab: convert2ObjectId(bodyData.vocab_id),
        }
    }
    if (bodyData.kanji_id && bodyData.kanji_id != '') {
        bodyData = {
            ...bodyData,
            kanji: convert2ObjectId(bodyData.kanji_id),
        }
    }

    const newFlCard = await flcardModel.create({
        deck: convert2ObjectId(deck_id),
        interval: interval,
        reviewDate: date,
        ...bodyData,
    })

    return newFlCard
}

const updateFlCard = async ({ flcard_id, level }) => {
    const flcardExists = await flcardModel.findById(convert2ObjectId(flcard_id))
    if (!flcardExists) throw new NotFoundError(`Flash Card not found`)

    const { date, interval } = nextReviewDate(level)

    flcardExists.reviewDate = date
    flcardExists.interval = interval
    await flcardExists.save()
    if (flcardExists.kanji) {
        const result = await flcardModel
            .findById(convert2ObjectId(flcard_id))
            .populate('kanji', 'kanji cn_vi_word component kunyomi onyomi')
            .lean()

        return {
            ...result,
            reviewDate: moment(new Date(result.reviewDate)).format(),
        }
    }
    if (flcardExists.vocab) {
        const result = await flcardModel
            .findById(convert2ObjectId(flcard_id))
            .populate('vocab')

        return {
            ...result,
            reviewDate: moment(new Date(result.reviewDate)).format(),
        }
    }
}

module.exports = {
    createDeck,
    addFlCardToDeck,
    updateFlCard,
    getAllDeckByUserId,
    getAllFlCardByDeck,
}
