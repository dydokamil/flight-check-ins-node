var express = require('express')
var router = express.Router()
const mongoose = require('mongoose')
const moment = require('moment')

const { MONGOOSE_CHECK_IN_DEV } = require('../consts')

const Reservation = require('../models/reservation')
const User = require('../models/user')
const Seat = require('../models/seat')

mongoose.connect(MONGOOSE_CHECK_IN_DEV)

router.post('/', async function (req, res) {
  if (!Object.keys(req.body).includes('token')) {
    res.status(401).json({ error: 'Provide `token`.' })
  } else if (!Object.keys(req.body).includes('seat')) {
    res.status(400).json({ error: 'Provide `seat` id.' })
  } else {
    const { token, seat } = req.body

    const decoded = await User.verifyToken(token)
    const { email } = decoded

    Reservation.makeReservation(email, seat)
      .then(result => res.json(result))
      .catch(err => {
        res.status(400).json({ error: err.message })
      })
  }
})

router.post('/random', async function (req, res) {
  if (!Object.keys(req.body).includes('token')) {
    res.status(401).json({ error: 'Provide `token`.' })
  } else {
    const { token } = req.body
    const decoded = await User.verifyToken(token)
    const { email } = decoded

    Reservation.makeRandomReservation(email)
      .then(response => res.json(response))
      .catch(err => res.status(400).json({ error: err.message }))
  }
})

router.get('/mine', async (req, res, next) => {
  if (!Object.keys(req.headers).includes('token')) {
    res.status(400).json('Provide `token`.')
  } else {
    const { token } = req.headers
    const decoded = await User.verifyToken(token)
    const { email } = decoded

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json('User not found')
    }

    const myReservation = await Reservation.findOne({
      user,
      reservedUntil: { $gte: moment.utc() }
    })

    if (!myReservation) {
      return res.json(myReservation)
    }

    const seat = await Seat.findById(myReservation.seat)

    return res.json({
      reservedUntil: myReservation.reservedUntil,
      seat,
      paid: myReservation.paid,
      price: myReservation.price
    })
  }
})

router.post('/cancel', async (req, res, next) => {
  if (!Object.keys(req.body).includes('token')) {
    return res.status(401).error({ error: 'Provide `token`.' })
  }

  const { token } = req.body
  const decoded = await User.verifyToken(token)
  const { email } = decoded

  const result = await Reservation.cancelReservation(email)
  return res.json(result)
})

module.exports = router
