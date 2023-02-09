import express from "express";
import db from "../db";
import { body, validationResult } from "express-validator";

// Initialize express router
const app = express.Router();

// Middleware to check if user exists
const userExists: express.RequestHandler = async (req, res, next) => {
  try {
    // Get the user from the database using the UUID from the request parameters
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    // If user is not found, throw an error
    if (!user) {
      throw new Error("User not found");
    }
    // Call the next middleware or handler
    return next();
  } catch (e) {
    // Log the error and return a response with a message "User not found"
    console.log(e);
    return res.status(400).json({ message: "User not found" });
  }
};

// Middleware to check if user is either an admin or the owner of the resource
const isAdminOrUser: express.RequestHandler = async (req, res, next) => {
  try {
    // Get the user from the database using the user id from the request object
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    // If user is an admin, call the next middleware or handler
    if (user?.isAdmin) {
      return next();
    }

    if (!req.body.id) {
      return res.status(400).json({ message: "Please specify an id user." });
    }

    // If user is not the owner, throw an error
    if (user?.id !== req.body.id) {
      return res.status(401).json({
        message: "You can't delete or modify an other user than you.",
      });
    }
    // Call the next middleware or handler
    return next();
  } catch (e) {
    // Log the error and return a response with a message "You are not the admin or owner"
    console.log(e);
    return res.status(400).json({ message: "You are not the admin or owner" });
  }
};

// Get endpoint to retrieve the user data
app.get("/user", async (req, res) => {
  try {
    // Get the user data from the database using the user id from the request object
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        username: true,
        name: true,
        posts: true,
        comments: true,
        isAdmin: true,
      },
    });
    // Return the user data in the response
    return res.status(200).json(user);
  } catch (e) {
    // Log the error and return a response with a message "An error occurred"
    console.error(e);
    return res.status(400).json({ message: "An error occurred" });
  }
});

// Endpoint to update the user data
app.put(
  "/user",
  // Validate that the "name" field exists and is a non-empty string
  body("name").exists().isString().notEmpty(),
  userExists,
  isAdminOrUser,
  async (req, res) => {
    try {
      // Throw an error if validation fails
      validationResult(req).throw();
      // Check if the "name" field is present in the request body
      if (!req.body.name) {
        return res.status(400).json({ message: "Invalid body provided" });
      }
      // Find the user by their id
      const user = await db.user.findUnique({
        where: {
          id: req.user.id,
        },
      });

      // Prevent administrators from updating their name
      if (user?.isAdmin) {
        return res.status(400).json({ message: "You can't do this" });
      }

      // Update the user's name
      const updatedUser = await db.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          name: req.body.name,
          username: req.body.username || undefined,
        },
      });

      // Return the updated user information
      return res
        .status(200)
        .json(`Name ${req.body.name} was modified successfully`);
    } catch (e) {
      console.error(e);
      return res.status(400).json({ message: "An error ocurred" });
    }
  }
);

// Endpoint to delete a user
app.delete("/user", userExists, isAdminOrUser, async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    // Find the user to delete by their id
    const userToDelete = await db.user.findUnique({
      where: {
        id: req.body.id,
      },
    });
    // Delete the user
    await db.user.delete({
      where: {
        id: userToDelete?.id,
      },
    });
    // Return a success message
    return res.status(200).json({
      message: `Successfully deleted user with id ${userToDelete?.id}`,
    });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: "An error ocurred" });
  }
});

// Export the app object
export default app;
