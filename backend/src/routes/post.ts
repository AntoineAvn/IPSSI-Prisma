import { Request, RequestHandler, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import db from "../db";

const app = Router();

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

app.get("/post/:uuid", async (req, res) => {
  try {
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

app.post(
  "/post",
  body("name").exists().isString().notEmpty(),
  async (req: Request, res: Response) => {
    try {
      validationResult(req).throw();
      const createdpost = await db.post.create({
        data: {
          name: req.body.name,
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

app.put(
  "/post/:uuid",
  body("name").exists().isString().notEmpty(),
  async (req, res) => {
    try {
      validationResult(req).throw();

      // Retrieve the post from the database
      const post = await db.post.findUnique({ where: { id: req.params?.uuid } });

      // Check if the post exists
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if the user is authorized to update the post
      if (post.userId !== req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const updatedPost = await db.post.update({
        where: {
          id: req.params?.uuid,
        },
        data: {
          name: req.body.name,
        },
      });

      return res.status(200).json(updatedPost);
    } catch (e) {
      return res.status(400).json({ message: e || "Error while updating" });
    }
  }
);


app.delete("/post/:uuid", async (req, res) => {
  try {
    await db.post.delete({
      where: {
        id: req.params.uuid,
      },
    });
    const post = await db.post.findUnique({ where: { id: req.params?.uuid } });

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is authorized to delete the post
    if (post.userId !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res
      .status(200)
      .json({ message: `Succesfully deleted ${req.params.uuid}` });
  } catch (e) {
    return res.status(400).json({ message: e || "Error while deleting" });
  }
});

export default app;
