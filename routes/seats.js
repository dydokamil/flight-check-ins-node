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
// router.get('/', function (req, res, next) {
//   Seat.find({}).then(seats => {
//     res.json(seats)
//   })
// })

router.get('/', async (req, res, next) => {
  // const reservations = await Reservation.find({})
  // if (reservations.length === 0) {
  //   return Seat.find({}).then(seats => res.json(seats))
  // }

  // get reserved seats
  // const notReservedSeats = await Reservation.find({
  //   reservedUntil: { $lte: moment.utc(), paid: false }
  // })
  let reservedSeats = await Reservation.find({
    reservedUntil: { $gte: moment.utc() }
  })
    .select('seat -_id')
    .lean()

  reservedSeats = reservedSeats.map(reservedSeat => reservedSeat.seat)
  reservedSeats = await Seat.find({
    _id: { $in: reservedSeats }
  })

  let notReservedSeats = await Seat.find({
    _id: {
      $nin: reservedSeats
    }
  }).lean()

  notReservedSeats = notReservedSeats.map(notReservedSeat => ({
    ...notReservedSeat,
    available: true
  }))

  res.json([
    ...Object.values(reservedSeats),
    ...Object.values(notReservedSeats)
  ])
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
