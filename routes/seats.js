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
