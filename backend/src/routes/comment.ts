import { RequestHandler, Router } from 'express'
import db from '../db'
import { body, validationResult } from 'express-validator'

const router = Router()

const isUsersPost: RequestHandler = async (req, res, next) => {
  try {
    const isOwner = await db.post.findFirstOrThrow({
      where: {
        userId: req.user.id
      }
    })
    if (!isOwner) {
      throw new Error('You should not be here')
    }
    return next()
  } catch(e) {
    console.log(e)
    return res.status(400).json({ message: 'You are not the owner' })
  }
} 

router.post(
  '/comment',
  body('postId').isUUID(),
  body('description').isString(),
  isUsersPost,
  async (req, res) => {
    try {
      validationResult(req).throw()
      const createdComment  = await db.comment.create({
        data: {
          postId: req.body.postId,
          description: req.body.description
        },
      })

      return res.status(201).json(createdComment)
    } catch (e) {
      return res.status(400).json({ message: e || 'Error during creation'})
    }
  }
)

router.put(
  '/comment/:uuid',
  isUsersPost,
  body('description').isLength({ min: 1 }),
  async (req, res) => {
    try {
      validationResult(req).throw()
      const updatedComment = await db.comment.update({
        where: {
          id: req.params?.uuid
        },
        data: {
          description: req.body.description
        }
      })
      res.status(200).json(updatedComment)
    } catch(e) {
      return res.status(400).json({ message: e || 'Error during update'})
    }
  }
)

router.delete(
  '/comment/:uuid',
  isUsersPost,
  async (req, res) => {
    try {
      const deletedId = req.params.uuid
      await db.comment.delete({
        where: {
          id: deletedId
        }
      })
      res.status(200).json({ message: `Successfully deleted ${deletedId}`})
    } catch(e) {
      return res.status(400).json({ e: e || 'Error during deletion'})
    }
  }
)

export default router