import { RequestHandler, Router } from 'express'
import db from '../db'
import { body, validationResult } from 'express-validator'

const router = Router()

const commentexists: RequestHandler = async (req, res, next) => {
  try {
    const comment = await db.comment.findFirst({
      where: {
        id: req.params?.uuid
      }
    })
    if (!comment) {
      throw new Error('Comment not found')
    }
    return next()
  } catch(e) {
    console.log(e)
    return res.status(400).json({ message: 'Comment not found' })
  }
}
const isAdminOrUserPost: RequestHandler = async (req, res, next) => {
  try {
    const user = await db.user.findFirst({
      where: {
        id: req.user.id
      }
    })
    if (user?.isAdmin) {
      return next()
    }
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
    return res.status(400).json({ message: 'You are not the admin or owner' })
  }
}


router.post(
  '/comment',
  commentexists,
  body('postId').isUUID(),
  body('description').isString(),
  isAdminOrUserPost,
  async (req, res) => {
    try {
      validationResult(req).throw()
      const createdComment  = await db.comment.create({
        data: {
          userId: req.user.id,
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
  "/comment/:uuid",
  commentexists,
  isAdminOrUserPost,
  body("description").isLength({ min: 1 }),
  async (req, res) => {
    try {
      validationResult(req).throw();
      // Find the comment with the given ID
      const comment = await db.comment.findFirst({
        where: {
          id: req.params?.uuid,
        },
      });
      const user = await db.user.findFirst({
        where: {
          id: req.user.id,
        },
      });

      if (user?.isAdmin) {
        return res.status(400).json({ message: "You are can't modify this" });
      }
      // Update the comment
      const updatedComment = await db.comment.update({
        where: {
          id: req.params?.uuid,
        },
        data: {
          description: req.body.description,
        },
      });
      return res.status(200).json(updatedComment);
    } catch (e) {
      return res.status(400).json({ message: e || "Error during update" });
    }
  }
);


router.delete(
  '/comment/:uuid',
  commentexists,
  isAdminOrUserPost,
  async (req, res) => {
    try {
      const deletedId = req.params.uuid
      const comment = await db.comment.findFirst({
        where: {
          id: req.params?.uuid,
        },
      });
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