'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
//const { pushToLogDiscord } = require('../middlewares')

const router = express.Router()

//router.use(pushToLogDiscord)

router.use(apiKey)
router.use(permission('0000'))

router.use('/v1/api/user', require('./user'))
router.use('/v1/api/upload', require('./upload'))
router.use('/v1/api/progress', require('./progress'))
router.use('/v1/api/trans', require('./trans'))
router.use('/v1/api/leaderboard', require('./leaderboard'))
router.use('/v1/api/leader', require('./leader'))
router.use('/v1/api/flashcard', require('./flashcard'))
router.use('/v1/api/kanji', require('./kanji'))
router.use('/v1/api/hina', require('./hina'))
router.use('/v1/api/email', require('./email'))
router.use('/v1/api/rbac', require('./rbac'))
router.use('/v1/api/profile', require('./profile')) //test permission
router.use('/v1/api/course', require('./course'))
router.use('/v1/api/exams', require('./exams'))
router.use('/v1/api/renshuu', require('./renshuu'))
router.use('/v1/api/lesson', require('./lesson'))
router.use('/v1/api/vocab', require('./vocab'))
router.use('/v1/api/grammar', require('./grammar'))
router.use('/v1/api/comment', require('./comment'))
router.use('/v1/api/notification', require('./notification'))
router.use('/v1/api', require('./access'))

module.exports = router
