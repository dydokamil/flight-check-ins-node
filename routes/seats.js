var express = require('express')
var router = express.Router()
const mongoose = require('mongoose')
const moment = require('moment')

const { MONGOOSE_CHECK_IN_DEV } = require('../consts')
const Reservation = require('../models/reservation')
const Seat = require('../models/seat')
const User = require('../models/user')

mongoose.connect(MONGOOSE_CHECK_IN_DEV)

/* GET seats listing. */
router.get('/', function (req, res, next) {
  Seat.find({}).then(seats => {
    res.json(seats)
  })
})

router.get('/available', async (req, res, next) => {
  const reservations = await Reservation.find({})
  if (reservations.length === 0) {
    return Seat.find({}).then(seats => res.json(seats))
  }

  // get reserved seats
  const reservedSeats = await Reservation.find({
    paid: false,
    reservedUntil: { $gte: moment.utc() }
  })
  const reservedSeatIds = reservedSeats.map(reservedSeat => reservedSeat.seat)

  const available = await Seat.find({ _id: { $nin: reservedSeatIds } })
  res.json(available)
})

router.get('/mine', async (req, res, next) => {
  if (!('email' in req.body)) res.json('Provide `email`.')
  else if (!('password' in req.body)) res.json('Provide `password`.')
  else {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json('User not found')
    }

    const same = await user.comparePassword(password)
    if (!same) return res.status(401).json('Password incorrect.')

    const myReservations = await Reservation.findOne({ user })
    return res.json(myReservations)
  }
})

module.exports = router
