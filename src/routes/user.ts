import express from 'express'

const app = express.Router()

app.get('/user', (req, res) => {
  console.log(req.user)
  return res.status(200).json({ message: 'you are a user' })
})

export default app