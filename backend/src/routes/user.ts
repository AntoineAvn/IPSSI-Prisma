import express from "express";
import db from "../db";

import { body, validationResult } from "express-validator";

const app = express.Router();

const userExists: express.RequestHandler = async (req, res, next) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: req.params?.uuid,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return next();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "User not found" });
  }
};

const isAdminOrUser: express.RequestHandler = async (req, res, next) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    if (user?.isAdmin) {
      return next();
    }
    const isOwner = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    if (!isOwner) {
      throw new Error("You should not be here");
    }
    return next();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "You are not the admin or owner" });
  }
};



app.get("/user", userExists, async (req, res) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        username: true,
      },
    });
    return res.status(200).json(user);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: "An error ocurred" });
  }
});

app.put("/user", 
body("name").exists().isString().notEmpty(),
userExists, isAdminOrUser, async (req, res) => {
  try {
    validationResult(req).throw();
    if (!req.body.name) {
      return res.status(400).json({ message: "Invalid body provided" });
    }
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if(user?.isAdmin) {
      return res.status(400).json({ message: "You can't do this" });
    }

    const updatedUser = await db.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        name: req.body.name,
      },
    });

    db.post.findMany({
      where: {
        userId: req.user.id,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: "An error ocurred" });
  }
});

app.delete("/user", userExists, isAdminOrUser ,async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const userToDelete = await db.user.findUnique({
      where: {
        id: req.body.id,
      },
    });
    await db.user.delete({
      where: {
        id: userToDelete?.id,
      },
    });
    return res
      .status(200)
      .json({ message: `Successfully deleted user with id ${userToDelete?.id}` });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: "An error ocurred" });
  }
});


export default app;
