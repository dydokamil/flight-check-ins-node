var express = require('express')
var router = express.Router()
const mongoose = require('mongoose')

const { MONGOOSE_CHECK_IN_DEV } = require('../consts')

const Seat = require('../models/seat')

mongoose.connect(MONGOOSE_CHECK_IN_DEV)

/* GET seats listing. */
router.get('/', function (req, res, next) {
  Seat.find({}).then(seats => {
    res.json(seats)
  })
})

module.exports = router
