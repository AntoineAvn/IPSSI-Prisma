import express from 'express'
import db from '../db'

const app = express.Router()

app.get('/user', async (req, res) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: req.user.id
      },
      select: {
        id: true,
        username: true
      }
    })
    return res.status(200).json(user)
  } catch(e) {
    console.error(e)
    return res.status(400).json({ message: 'An error ocurred' })
  }
})


app.put('/user', async (req, res) => {
  try {
    if (!req.body.name)  {
      return res.status(400).json({ message: 'Invalid body provided' })
    }

    const updatedUser = await db.user.update({
      where: {
        id: req.user.id
      },
      data: {
        name: req.body.name
      }
    })

    return res.status(200).json(updatedUser)
  } catch(e) {
    console.error(e)
    return res.status(400).json({ message: 'An error ocurred' })
  }
})

export default app