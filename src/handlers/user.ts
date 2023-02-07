import { RequestHandler } from "express";
import db from "../db";
import { createJWT, hashPassword } from "../modules/auth";

export const createNewUser: RequestHandler = async (req, res) => {
  if (!(req.body.username && req.body.password)) {
    return res.status(400).json({ message: 'Invalid body provided' })
  }

  const hash = await hashPassword(req.body.password)

  const user = await db.user.create({
    data: {
      username: req.body.username,
      password: hash
    }
  })

  const token = createJWT(user)
  res.status(201).json({ token })
}