'use strict'

const { NotFoundError } = require('../core/error.response')
const commentModel = require('../models/comment.model')
const { convert2ObjectId } = require('../utils')
const lessonModel = require('../models/lesson.model')

class CommentService {
    static createComment = async ({
        lesson_id,
        user_id,
        content,
        parentCommentId = null,
    }) => {
        const comment = new commentModel({
            comment_lessonId: lesson_id,
            commentUserId: user_id,
            comment_content: content,
            comment_parentId: parentCommentId,
        })

        let rightValue
        if (parentCommentId) {
            const parentComment = await commentModel.findById(parentCommentId)
            if (!parentComment) throw new NotFoundError('Not found comment')

            rightValue = parentComment.comment_right
            //update many comments
            await commentModel.updateMany(
                {
                    comment_lessonId: convert2ObjectId(lesson_id),
                    comment_right: { $gte: rightValue },
                },
                {
                    $inc: { comment_right: 2 },
                }
            )

            await commentModel.updateMany(
                {
                    comment_lessonId: convert2ObjectId(lesson_id),
                    comment_left: { $gt: rightValue },
                },
                {
                    $inc: { comment_left: 2 },
                }
            )
        } else {
            const maxRightValue = await commentModel.findOne(
                {
                    comment_lessonId: convert2ObjectId(lesson_id),
                },
                'comment_right',
                { sort: { comment_right: -1 } }
            )
            if (maxRightValue) {
                rightValue = maxRightValue.right + 1
            } else {
                rightValue = 1
            }
        }
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()

        return comment
    }

    static getCommentsByParentId = async ({
        lesson_id,
        parentCommentId = null,
        limit = 50,
        offset = 0, //skip
    }) => {
        if (parentCommentId) {
            const parent = await commentModel.findById(parentCommentId)
            if (!parent) throw new NotFoundError('Parent comment not found')

            const comments = await commentModel
                .find({
                    comment_lessonId: convert2ObjectId(lesson_id),
                    comment_left: { $gt: parent.comment_left },
                    comment_right: { $lte: parent.comment_right },
                })
                .select({
                    comment_left: 1,
                    comment_right: 1,
                    comment_content: 1,
                    comment_parentId: 1,
                })
                .sort({
                    comment_left: 1,
                })

            return comments
        }
        const comments = await commentModel
            .find({
                comment_lessonId: convert2ObjectId(lesson_id),
                comment_parentId: parentCommentId,
            })
            .select({
                comment_left: 1,
                commnet_right: 1,
                comment_content: 1,
                comment_parentId: 1,
            })
            .sort({
                comment_left: 1,
            })

        return comments
    }

    static deleteComment = async ({ comment_id, lesson_id }) => {
        //check lesson exists
        const lessonExists = await lessonModel.findById(lesson_id)

        if (!lessonExists) throw new NotFoundError('lesson not found')

        //xac dinh left, right comment delete
        const comment = await commentModel.findById(comment_id)
        if (!comment) throw new NotFoundError('comment not found')

        const left = comment.comment_left
        const right = comment.comment_right
        //tinh width
        const width = right - left + 1
        //xoa cum comment con
        await commentModel.deleteMany({
            comment_lessonId: convert2ObjectId(lesson_id),
            comment_left: { $gte: left, $lte: right },
        })
        //cap nhat left, right
        await commentModel.updateMany(
            {
                comment_lessonId: convert2ObjectId(lesson_id),
                comment_right: { $gt: right },
            },
            {
                $inc: { comment_right: -width },
            }
        )
        await commentModel.updateMany(
            {
                comment_lessonId: convert2ObjectId(lesson_id),
                comment_left: { $gt: right },
            },
            {
                $inc: { comment_left: -width },
            }
        )

        return true
    }
}

module.exports = CommentService
