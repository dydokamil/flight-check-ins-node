var express = require('express')
var router = express.Router()
const mongoose = require('mongoose')
const moment = require('moment')

const { MONGOOSE_CHECK_IN_DEV } = require('../consts')
const Reservation = require('../models/reservation')

const Seat = require('../models/seat')

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

module.exports = router
