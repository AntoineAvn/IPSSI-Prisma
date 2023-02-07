import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'

export interface JWTUser {
  id: string;
  name: string;
}

export const createJWT = (user: JWTUser) => {
  const token = jwt.sign({
    id: user.id,
    name: user.name
  }, (process.env.JWT_SECRET as string))
  return token
}

export const protect: RequestHandler = (req, res, next) => {
  const bearer = req.headers.authorization

  if (!bearer) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const [, token] = bearer.split(' ')

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const payload = jwt.verify(token, (process.env.JWT_SECRET as string)) as JWTUser
    req.user = payload
    return next()
  } catch(e) {
    console.error(e)
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10)
}

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash)
}