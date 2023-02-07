import { RequestHandler, Router } from 'express'
import db from '../db'
import { body, validationResult } from 'express-validator'

const router = Router()

const isUsersTodo: RequestHandler = async (req, res, next) => {
  try {
    const isOwner = await db.todoList.findFirstOrThrow({
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
  '/todoItem',
  body('todoListId').isUUID(),
  body('description').isString(),
  isUsersTodo,
  async (req, res) => {
    try {
      validationResult(req).throw()
      const createdTodoItem  = await db.todoItem.create({
        data: {
          todoListId: req.body.todoListId,
          description: req.body.description
        },
      })

      return res.status(201).json(createdTodoItem)
    } catch (e) {
      return res.status(400).json({ message: e || 'Error during creation'})
    }
  }
)

router.put(
  '/todoItem/:uuid',
  isUsersTodo,
  body('description').isLength({ min: 1 }),
  async (req, res) => {
    try {
      validationResult(req).throw()
      const updatedItem = await db.todoItem.update({
        where: {
          id: req.params?.uuid
        },
        data: {
          description: req.body.description
        }
      })
      res.status(200).json(updatedItem)
    } catch(e) {
      return res.status(400).json({ message: e || 'Error during update'})
    }
  }
)

router.delete(
  '/todoItem/:uuid',
  isUsersTodo,
  async (req, res) => {
    try {
      const deletedId = req.params.uuid
      await db.todoItem.delete({
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