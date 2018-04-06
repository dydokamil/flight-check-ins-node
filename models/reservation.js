const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schema

const ReservationSchema = new Schema({
  seat: { type: Schema.Types.ObjectId, ref: 'Seat' },
  reservedUntil: { type: Date, default: moment.utc().add('minutes', 3) },
  paid: { type: Schema.Types.Boolean }
})

module.exports = mongoose.model('Seat', ReservationSchema)
