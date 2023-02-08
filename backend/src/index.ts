import express from 'express'
import * as dotenv from 'dotenv'
import { protect } from './modules/auth'
import userRouter from './routes/user'
import todoListRouter from './routes/todoList'
import todoItemRouter from './routes/todoItem'
import { createNewUser, signIn } from './handlers/user'

import config from "./config" //import env/serv:port

dotenv.config()

const app = express()

app.use(express.json())

app.get('/', async (req, res) => {
  return res.json({ message: 'Bonsoir' })
})

app.use('/api', protect, [
  userRouter,
  todoListRouter,
  todoItemRouter
])

app.post('/sign-up', createNewUser)
app.post('/sign-in', signIn)

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port} on ${config.stage} environnement`)
})