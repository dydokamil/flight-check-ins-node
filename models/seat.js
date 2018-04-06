const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SeatSchema = new Schema({
  fee: Schema.Types.Number
})

module.exports = mongoose.model('Seat', SeatSchema)
