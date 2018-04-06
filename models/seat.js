const mongoose = require('mongoose')

const Reservation = require('./reservation')

const Schema = mongoose.Schema

const SeatSchema = new Schema({
  fee: Schema.Types.Number
})

SeatSchema.statics.removeAllSeats = function () {
  return this.remove({})
}

SeatSchema.statics.getAvailableSeats = function () {
  Reservation.find({}).then(reservations => {
    if (reservations.length === 0) {
      return this.find({})
    }
  })
}

module.exports = mongoose.model('Seat', SeatSchema)
