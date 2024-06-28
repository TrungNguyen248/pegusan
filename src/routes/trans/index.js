'use strict'

const express = require('express')
const axios = require('axios')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()
router.use(authentication)

router.post('/1/', async (req, res) => {
    try {
        const searchText = encodeURI(req.body.text)
        console.log(searchText)
        const response = await axios.get(
            `https://translate.google.com/translate_a/single?q=${searchText}&sl=vi&tl=ja&hl=en&client=it&otf=2&dj=1&ie=UTF-8&oe=UTF-8&dt=t&dt=rmt&dt=bd&dt=rms&dt=qca&dt=ss&dt=md&dt=ld&dt=ex&dt=rw`
        )
        res.status(200).send(response.data)
    } catch (error) {
        res.status(500).send(error.toString())
    }
})

router.post('/2/', async (req, res, next) => {
    try {
        const searchText = encodeURI(req.body.text)
        // console.log(searchText)
        const response = await axios.get(
            `https://api.tracau.vn/WBBcwnwQpV89/dj/${searchText}`
        )
        res.status(200).send(response.data)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router
