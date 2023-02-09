import { RequestHandler, Router } from 'express'
import db from '../db'
import { body, validationResult } from 'express-validator'

// Create a new Router object
const router = Router()

// Middleware function to check if the comment exists
const commentexists: RequestHandler = async (req, res, next) => {
  try {
    // Check if a comment with the given ID exists
    const comment = await db.comment.findFirst({
      where: {
        id: req.params?.uuid
      }
    })
    // If the comment doesn't exist, throw an error
    if (!comment) {
      throw new Error('Comment not found')
    }
    // If the comment exists, call the next middleware function
    return next()
  } catch(e) {
    console.log(e)
    // Return a 400 Bad Request response with a message if the comment doesn't exist
    return res.status(400).json({ message: 'Comment not found' })
  }
}

// Middleware function to check if the user is an admin or the owner of the post
const isAdminOrUserPost: RequestHandler = async (req, res, next) => {
  try {
    // Check if the user is an admin
    const user = await db.user.findFirst({
      where: {
        id: req.user.id
      }
    })
    if (user?.isAdmin) {
      // If the user is an admin, call the next middleware function
      return next()
    }
    // Check if the user is the owner of the post
    const isOwner = await db.post.findFirstOrThrow({
      where: {
        userId: req.user.id
      }
    })
    if (!isOwner) {
      // If the user isn't the owner of the post, throw an error
      throw new Error('You should not be here')
    }
    // If the user is the owner of the post, call the next middleware function
    return next()
  } catch(e) {
    console.log(e)
    // Return a 400 Bad Request response with a message if the user isn't an admin or the owner of the post
    return res.status(400).json({ message: 'You are not the admin or owner' })
  }
}

// Endpoint for creating a new comment
router.post(
  '/comment',
  // Call the commentexists middleware function
  commentexists,
  // Validate the postId field in the request body
  body('postId').isUUID(),
  // Validate the description field in the request body
  body('description').isString(),
  // Call the isAdminOrUserPost middleware function
  isAdminOrUserPost,
  async (req, res) => {
    try {
      // Check if there are any validation errors
      validationResult(req).throw()
      // Create a new comment
      const createdComment  = await db.comment.create({
        data: {
          userId: req.user.id,
          postId: req.body.postId,
          description: req.body.description
        },
      })
      // Return a 201 Created response with the created comment
      return res.status(201).json(createdComment)
    } catch(e) {
      // Return a 400 Bad Request response with a message if there are any validation errors
      return res.status(400).json({ message: e || 'Error during creation' })
    }
  }
)


// Endpoint for modifying a comment
router.put(
  "/comment/:uuid",
  // Call the commentexists middleware function
  commentexists,
  // Call the isAdminOrUserPost middleware function
  isAdminOrUserPost,
  // Validate the description field in the request body
  body("description").isLength({ min: 1 }),
  async (req, res) => {
    try {
      // Check if there are any validation errors
      validationResult(req).throw();
      // Find the comment with the given ID
      const user = await db.user.findFirst({
        where: {
          id: req.user.id,
        },
      });
      // Check if the user is an admin
      if (user?.isAdmin) {
        return res.status(400).json({ message: "You can't modify this" });
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
      // Return a 200 OK response with the updated comment
      return res.status(200).json(updatedComment);
    } catch (e) {
      // Return a 400 Bad Request response with a message if there are any validation errors
      return res.status(400).json({ message: e || "Error during update" });
    }
  }
);

// Endpoint for deleting a comment
router.delete(
  '/comment/:uuid',
  // Call the commentexists middleware function
  commentexists,
  // Call the isAdminOrUserPost middleware function
  isAdminOrUserPost,
  async (req, res) => {
    try {
      // Find the comment with the given ID
      const deletedId = req.params.uuid
      // Delete the comment
      await db.comment.delete({
        where: {
          id: deletedId
        }
      })
      // Return a 200 OK response with a message
      res.status(200).json({ message: `Successfully deleted ${deletedId}`})
    } catch(e) {
      // Return a 400 Bad Request response with a message if there are any validation errors
      return res.status(400).json({ e: e || 'Error during deletion'})
    }
  }
)
// Export the router object
export default router