import { RequestHandler } from "express";
import db from "../db";
import { comparePassword, createJWT, hashPassword } from "../modules/auth";

export const createNewUser: RequestHandler = async (req, res) => {
  try {
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
    return res.status(201).json({ token })
  } catch(e) {
    console.error(e)
    return res.status(400).json({ error: e?.toString() || 'An error occured' })
  }
}

export const signIn: RequestHandler = async (req, res) => {
  try {
    if (!(req.body.username && req.body.password)) {
      return res.status(400).json({ message: 'Invalid body provided' })
    }

    const user = await db.user.findUnique({
      where: {
        username: req.body.username
      }
    })

    if (user) {
      const isValid = await comparePassword(req.body.password, user.password)
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid password' })
      }

      const token = createJWT(user)
      return res.status(200).json({ token })
    } 

    return res.status(404).json({ message: 'This user doesn\'t exists' })
  } catch(e) {
    console.error(e)
    return res.status(400).json({ error: e?.toString() || 'An error occured during signIn' })
  }
}