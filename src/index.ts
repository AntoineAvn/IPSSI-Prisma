import express from 'express'
import * as dotenv from 'dotenv'
import { protect } from './modules/auth'
import userRouter from './routes/user'

dotenv.config()

const app = express()

app.use(express.json())

app.get('/', async (req, res) => {
  return res.json({ message: 'Bonsoir' })
})

app.use('/api', protect, [
  userRouter
])

app.listen(1234, () => {
  console.log('Listening on port 1234')
})