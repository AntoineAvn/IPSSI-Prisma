import express, { RequestHandler } from 'express'
import * as dotenv from 'dotenv'
import db from './db'

dotenv.config()

const app = express()

app.use(express.json())

app.get('/', async (req, res) => {
  return res.json({ message: 'Bonsoir' })
})

// app.use('/api', protect, [])

app.listen(1234, () => {
  console.log('Listening on port 1234')
})