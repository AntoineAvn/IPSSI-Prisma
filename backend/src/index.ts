import express from 'express'
import * as dotenv from 'dotenv'
import { protect } from './modules/auth'
import userRouter from './routes/user'
import postRouter from './routes/post'
import commentRouter from './routes/comment'
import { createNewUser, signIn } from './handlers/user'
import cors from 'cors'

import config from "./config" //import env/serv:port

dotenv.config()

const app = express()

app.use(express.json())

app.use(cors())

app.get('/', async (req, res) => {
  return res.json({ message: 'Bienvenue sur l\API de Tom Picout, Alex Selebran et Antoine Avenia' })
})

app.use('/api', protect, [
  userRouter,
  postRouter,
  commentRouter
])

app.post('/sign-up', createNewUser)
app.post('/sign-in', signIn)

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port} on ${config.stage} environnement`)
})