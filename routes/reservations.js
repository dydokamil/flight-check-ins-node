var express = require('express')
var router = express.Router()
const mongoose = require('mongoose')

const { MONGOOSE_CHECK_IN_DEV } = require('../consts')

const Reservation = require('../models/reservation')

mongoose.connect(MONGOOSE_CHECK_IN_DEV)

router.post('/', function (req, res) {
  if (!('email' in req.body)) res.json('Provide `email`.')
  else if (!('password' in req.body)) res.json('Provide `password`.')
  else if (!('seat' in req.body)) res.json('Provide `seat` id.')
  else {
    // console.log(req.body)

    const { email, password, seat } = req.body

    Reservation.makeReservation(email, password, seat)
      .then(result => {
        return res.json(result)
        // return res.json(result)
      })
      .catch(err => res.status(400).json(err.message))
  }
})

module.exports = router
