const mongoose = require('mongoose')

const Reservation = require('./reservation')

const Schema = mongoose.Schema

const SeatSchema = new Schema({
  fee: Schema.Types.Number,
  // available: { type: Schema.Types.Boolean, default: true },
  id: Number
  // reservation: { type: Schema.Types.ObjectId, ref: 'Reservation' }
})

SeatSchema.statics.removeAllSeats = function () {
  return this.remove({})
}

module.exports = mongoose.model('Seat', SeatSchema)
