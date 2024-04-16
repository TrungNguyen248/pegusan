'use strict'

const CommentService = require('../services/comment.service')
const { SuccessResponse } = require('../core/success.response')

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'create new comment',
            metadata: await CommentService.createComment(req.body),
        }).send(res)
    }

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'create new comment',
            metadata: await CommentService.getCommentsByParentId(req.query),
        }).send(res)
    }
    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'delete comment successfully',
            metadata: await CommentService.deleteComment(req.body),
        }).send(res)
    }
}

module.exports = new CommentController()
