import express from "express";
import db from "../db";

const app = express.Router();

app.get("/user", async (req, res) => {
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

app.put("/user", async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "Invalid body provided" });
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

app.delete("/user", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const userToDelete = await db.user.findUnique({
      where: {
        id: req.body.id,
      },
    });
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    if (!userToDelete) {
      return res.status(400).json({ message: "User not found" });
    }
    if (req.user.id !== userToDelete.id && user?.isAdmin === false) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this user" });
    }

    const posts = await db.post.findMany({
      where: {
        userId: userToDelete.id,
      },
    });
    for (const post of posts) {
      await db.post.delete({
        where: {
          id: post.id,
        },
      });
    }
    const comments = await db.comment.findMany({
      where: {
        userId: userToDelete.id,
      },
    });
    for (const comment of comments) {
      await db.comment.delete({
        where: {
          id: comment.id,
        },
      });
    }
    await db.user.delete({
      where: {
        id: userToDelete.id,
      },
    });
    return res
      .status(200)
      .json({ message: `Successfully deleted user with id ${userToDelete.id}` });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: "An error ocurred" });
  }
});


export default app;
