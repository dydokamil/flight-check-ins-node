var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const User = require('../models/user')

const privateKey = fs.readFileSync(
  path.join(__dirname, '../keys/private_key.pem')
)

// singup route
router.post('/', async (req, res) => {
  if (!('email' in req.body) || req.body.email.length === 0) {
    res.status(400).json({ error: 'Provide `email`.' })
  } else if (!('password' in req.body) || req.body.password.length === 0) {
    res.status(400).json({
      error: 'Provide `password`.'
    })
  } else {
    // res.json(User.createUser(email, password))
    const { email, password } = req.body
    const result = await User.createUser(email, password)
    // check if duplicate error code
    if (result.code === 11000) {
      res.status(400).json({ error: 'This email is already taken!' })
    } else {
      const token = generateToken(result.email)
      res.json({ token, email }).catch(err => res.status(500).json(err))
    }
  }
})

function generateToken (email) {
  return jwt.sign({ email }, privateKey)
}

// login route
router.post('/login', async (req, res) => {
  if (!('email' in req.body) || req.body.email.length === 0) {
    res.status(400).json({ error: 'Provide `email`.' })
  } else if (!('password' in req.body) || req.body.password.length === 0) {
    res.status(400).json({
      error: 'Provide `password`.'
    })
  } else {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      res.status(404).json({ error: 'Email not found.' })
    } else {
      const same = await user.comparePassword(password)

      if (!same) {
        res.status(401).json({ error: 'Password incorrect.' })
      } else {
        // generate token
        res.json({ token: generateToken(user.email), email: user.email })
      }
    }
  }
})

module.exports = router
