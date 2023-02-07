import express from 'express'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  return res.json({ message: 'Bonsoir' })
})

app.listen(1234, () => {
  console.log('Listening on port 1234')
})