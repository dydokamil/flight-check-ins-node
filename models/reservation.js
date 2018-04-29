const mongoose = require('mongoose')
const moment = require('moment')

const User = require('./user')
const Seat = require('./seat')

const Schema = mongoose.Schema

const ReservationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  seat: { type: Schema.Types.ObjectId, ref: 'Seat' },
  reservedUntil: { type: Date },
  paid: { type: Schema.Types.Boolean, default: false }
})

ReservationSchema.statics.makeReservation = async function (email, seatId) {
  // check if this user has already made a reservation
  const user = await User.findOne({ email })
  if (!user) throw new Error('User not found!')
  const reservationForUser = await this.findOne({
    user,
    reservedUntil: {
      $gte: moment.utc()
    }
  })
  if (reservationForUser) {
    throw new Error('You have already made a reservation.')
  }
  const seat = await Seat.findOne({ id: seatId })
  if (!seat) throw new Error('Seat not found!')

  // check if this seat has already been reserved
  const reservationForSeat = await this.findOne({
    seat,
    reservedUntil: {
      $gte: moment.utc()
    }
  })
  if (reservationForSeat) {
    throw new Error('This seat is already reserved.')
  }

  // create a new reservation insance
  const seatToReserve = await Seat.findOne({ id: seatId })
  const reservation = new this({
    user,
    seat: seatToReserve,
    reservedUntil: moment.utc().add(3, 'minutes')
  })
  return reservation.save().then(res => ({
    _id: res._id,
    paid: res.paid,
    reservedUntil: res.reservedUntil,
    seat: res.seat
  }))
}

ReservationSchema.statics.removeAllReservations = function () {
  return this.remove({})
}

module.exports = mongoose.model('Reservation', ReservationSchema)
