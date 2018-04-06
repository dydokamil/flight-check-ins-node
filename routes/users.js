var express = require('express')
var router = express.Router()

const User = require('../models/user')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.post('/', (req, res) => {
  if (!('email' in req.body)) res.json('Provide `email`.')
  else if (!('password' in req.body)) res.json('Provide `password`.')
  else {
    // res.json(User.createUser(email, password))
    const { email, password } = req.body
    User.createUser(email, password)
      .then(response => res.json(response))
      .catch(err => res.json(err))
  }
})

module.exports = router
