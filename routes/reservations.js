var express = require('express')
var router = express.Router()
const mongoose = require('mongoose')

const { MONGOOSE_CHECK_IN_DEV } = require('../consts')

const Reservation = require('../models/reservation')
const User = require('../models/user')

mongoose.connect(MONGOOSE_CHECK_IN_DEV)

router.post('/', async function (req, res) {
  if (!('token' in req.body)) {
    res.status(401).json({ error: 'Provide `token`.' })
  } else if (!('seat' in req.body)) {
    res.status(400).json({ error: 'Provide `seat` id.' })
  } else {
    const { token, seat } = req.body

    const decoded = await User.verifyToken(token)
    const { email } = decoded

    console.log('Listen here fam', decoded)

    Reservation.makeReservation(email, seat)
      .then(result => res.json(result))
      .catch(err => res.status(400).json({ error: err.message }))
  }
})

router.post('/random', async function (req, res) {
  if (!('token' in req.body)) {
    res.status(401).json({ error: 'Provide `token`.' })
  } else {
    const { token } = req.body
    const decoded = await User.verifyToken(token)
    const { email } = decoded

    Reservation.makeRandomReservation(email)
      .then(response => res.json(response))
      .catch(err => {
        console.log('ERR', err)
        res.status(500).json({ error: err })
      })
  }
})

module.exports = router
