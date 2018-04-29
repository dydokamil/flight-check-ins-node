var express = require('express')
var router = express.Router()
const mongoose = require('mongoose')

const { MONGOOSE_CHECK_IN_DEV } = require('../consts')
const { BASE_PRICE, CHECK_IN_FEE } = require('../consts')
const Reservation = require('../models/reservation')
const User = require('../models/user')

mongoose.connect(MONGOOSE_CHECK_IN_DEV)

router.get('/', async (req, res, next) => {
  const {
    reservedSeats,
    notReservedSeats
  } = await Reservation.getSeatsAndReservations()

  let seats = [
    ...Object.values(reservedSeats),
    ...Object.values(notReservedSeats)
  ]
  seats = seats.sort((seat1, seat2) => seat1.id - seat2.id)

  res.json({ seats, basePrice: BASE_PRICE, checkInFee: CHECK_IN_FEE })
})

module.exports = router
