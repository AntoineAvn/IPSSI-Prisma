import { Request, RequestHandler, Response, Router } from "express";
import { body, check, validationResult } from "express-validator";
import db from "../db";

// Initialize the Router
const app = Router();

// Middleware that checks if a post exists
const postexists: RequestHandler = async (req, res, next) => {
  try {
    // Search for a post with the given id
    const post = await db.post.findFirst({
      where: {
        id: req.params?.uuid,
      },
    });
    // If the post doesn't exist, throw an error
    if (!post) {
      throw new Error("Post not found");
    }
    // If the post exists, move on to the next middleware
    return next();
  } catch (e) {
    console.log(e);
    // If an error occurs, send a response with a message indicating that the post was not found
    return res.status(400).json({ message: "Post not found" });
  }
};

// Middleware that checks if the user is an admin or the owner of the post
const isAdminOrUserPost: RequestHandler = async (req, res, next) => {
  try {
    // Find the user with the given id
    const user = await db.user.findFirst({
      where: {
        id: req.user.id,
      },
    });
    // If the user is an admin, move on to the next middleware
    if (user?.isAdmin) {
      return next();
    }
    // If the user is not an admin, check if they are the owner of the post
    const isOwner = await db.post.findFirstOrThrow({
      where: {
        userId: req.user.id,
      },
    });
    // If the user is not the owner, throw an error
    if (!isOwner) {
      throw new Error("You should not be here");
    }
    // If the user is the owner, move on to the next middleware
    return next();
  } catch (e) {
    console.log(e);
    // If an error occurs, send a response indicating that the user is not authorized to perform this action
    return res.status(400).json({ message: "You are not the admin or owner" });
  }
};

// Route for retrieving all posts
app.get("/posts", async (req, res) => {
  try {
    // Read the from parameter from the query string
    const fromTimestamp = Number(req.query.from) * 1000;

    // Query the database using Prisma's ORM
    const posts = await db.post.findMany({
      where: {
        createdAt: {
          // If the from parameter is present, use it to filter the posts
          gte: fromTimestamp ? new Date(fromTimestamp) : undefined,
        },
        userId: req.user.id,
      },
      include: {
        comments: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json(posts);
  } catch (e) {
    return res.status(400).json({ message: "Error while fetching posts" });
  }
});

app.get("/post/:uuid",
postexists,
//Check uuid param
check("uuid").isUUID(),
 async (req, res) => {
  try {
    // Find the post with the specified ID
    const post = await db.post.findFirstOrThrow({
      where: {
        id: req.params.uuid,
        userId: req.user.id,
      },
      include: {
        comments: true,
      },
    });

    return res.status(200).json(post);
  } catch (e) {
    return res.status(400).json({ message: "Not found" });
  }
});

// Route for creating a new post
app.post(
  "/post",
  body("name").exists().isString().notEmpty(),
  async (req: Request, res: Response) => {
    try {
      // Check if the request body is valid
      validationResult(req).throw();

      // Create a new post in the database
      const createdpost = await db.post.create({
        data: {
          name: req.body.name,
          content: req.body.content,
          userId: req.user.id,
        },
      });

      return res.status(201).json(createdpost);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: e || "Cannot create post" });
    }
  }
);

// Route for updating a post
app.put(
  "/post/:uuid",
  // Middleware to check if the post exists
  postexists,
  // Middleware to check if the user making the request is either an admin or the author of the post
  isAdminOrUserPost,
  // Middleware to validate the request body
  body("name").exists().isString().notEmpty(),
  //Check uuid param
  check("uuid").isUUID(),
  async (req, res) => {
    try {
      // Check if the request body is valid
      validationResult(req).throw();

      // Retrieve the post from the database
      const post = await db.post.findUnique({
        where: { id: req.params?.uuid },
      });

      // Retrieve the user from the database
      const user = await db.user.findUnique({ where: { id: req.user.id } });

      // Check if the user is an admin
      if (user?.isAdmin) {
        // If the user is an admin, return an error message
        return res.status(401).json({ message: "You can't modify this" });
      }
      // Update the post in the database
      const updatedPost = await db.post.update({
        where: {
          id: req.params?.uuid,
        },
        data: {
          name: req.body.name,
        },
      });

      // Return the updated post in the response
      return res.status(200).json(updatedPost);
    } catch (e) {
      // If an error occurs, return an error message
      return res.status(400).json({ message: e || "Error while updating" });
    }
  }
);

// Route for deleting a post
app.delete(
  "/post/:uuid",
  // Middleware to check if the post exists
  postexists,
  // Middleware to check if the user making the request is either an admin or the author of the post
  isAdminOrUserPost,
  //Check uuid param
  check("uuid").isUUID(),
  async (req, res) => {
    try {
      // Retrieve the post from the database
      const post = await db.post.findUnique({
        where: { id: req.params?.uuid },
      });
      // Retrieve the user from the database
      const user = await db.user.findUnique({ where: { id: req.user.id } });
      // Delete the post from the database
      await db.post.delete({
        where: {
          id: req.params.uuid,
        },
      });
      // Return a success message
      return res
        .status(200)
        .json({ message: `Succesfully deleted ${req.params.uuid}` });
    } catch (e) {
      // If an error occurs, return an error message
      return res.status(400).json({ message: e || "Error while deleting" });
    }
  }
);

// Export the express app
export default app;
