import express from 'express'

const app = express.Router()

app.get('/user', (req, res) => {
  return res.status(200).json({ message: 'you are a user' })
})

export default app