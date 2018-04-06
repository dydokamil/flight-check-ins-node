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

router.get('/available', (req, res, next) => {
  Reservation.find({}).then(reservations => {
    if (reservations.length === 0) {
      return Seat.find({}).then(seats => res.json(seats))
    }

    // get reserved seats
    Reservation.find({
      paid: false,
      reservedUntil: { $gte: moment.utc() }
    }).then(reservedSeats => {
      const reservedSeatIds = reservedSeats.map(
        reservedSeat => reservedSeat.seat
      )

      Seat.find({ _id: { $nin: reservedSeatIds } }).then(available =>
        res.json(available)
      )
    })
  })
})

router.get('/mine', (req, res, next) => {
  if (!('email' in req.body)) res.json('Provide `email`.')
  else if (!('password' in req.body)) res.json('Provide `password`.')
  else {
    const { email, password } = req.body
    User.findOne({ email }).then(user => {
      if (!user) {
        return res.status(404).json('User not found')
      }

      user.comparePassword(password).then(same => {
        if (!same) return res.status(401).json('Password incorrect.')

        Reservation.findOne({ user }).then(myReservations => {
          return res.json(myReservations)
        })
      })
    })
  }
})

module.exports = router
