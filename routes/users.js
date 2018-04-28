var express = require('express')
var router = express.Router()

const User = require('../models/user')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

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
      res.json(result).catch(err => res.status(500).json(err))
    }
  }
})

module.exports = router
