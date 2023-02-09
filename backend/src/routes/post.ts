import { Request, RequestHandler, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import db from "../db";

const app = Router();

const postexists: RequestHandler = async (req, res, next) => {
  try {
    const post = await db.post.findFirst({
      where: {
        id: req.params?.uuid,
      },
    });
    if (!post) {
      throw new Error("Post not found");
    }
    return next();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Post not found" });
  }
};

const isAdminOrUserPost: RequestHandler = async (req, res, next) => {
  try {
    const user = await db.user.findFirst({
      where: {
        id: req.user.id,
      },
    });
    if (user?.isAdmin) {
      return next();
    }
    const isOwner = await db.post.findFirstOrThrow({
      where: {
        userId: req.user.id,
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

app.get("/post/:uuid", postexists, async (req, res) => {
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
  postexists,
  isAdminOrUserPost,
  body("name").exists().isString().notEmpty(),
  async (req, res) => {
    try {
      validationResult(req).throw();

      // Retrieve the post from the database
      const post = await db.post.findUnique({ where: { id: req.params?.uuid } });
      const user = await db.user.findUnique({ where: { id: req.user.id } });

      if (user?.isAdmin) {
        return res.status(401).json({ message: "You can't modify this" });
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


app.delete("/post/:uuid", postexists, isAdminOrUserPost, async (req, res) => {
  try {
    const post = await db.post.findUnique({ where: { id: req.params?.uuid } });
    const user = await db.user.findUnique({ where: { id: req.user.id } });
    // Check if the user is authorized to delete the post
    await db.post.delete({
      where: {
        id: req.params.uuid,
      },
    });
    return res
      .status(200)
      .json({ message: `Succesfully deleted ${req.params.uuid}` });
  } catch (e) {
    return res.status(400).json({ message: e || "Error while deleting" });
  }
});

export default app;
