const mongoose = require('mongoose')

// const Reservation = require('./reservation')

const Schema = mongoose.Schema

const SeatSchema = new Schema({
  fee: Schema.Types.Number,
  id: Number
})

SeatSchema.statics.removeAllSeats = function () {
  return this.remove({})
}

module.exports = mongoose.model('Seat', SeatSchema)
