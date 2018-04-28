const mongoose = require('mongoose')
const moment = require('moment')

const User = require('./user')
const Seat = require('./seat')

const Schema = mongoose.Schema

const ReservationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  seat: { type: Schema.Types.ObjectId, ref: 'Seat' },
  reservedUntil: { type: Date, default: moment.utc().add(3, 'minutes') },
  paid: { type: Schema.Types.Boolean, default: false }
})

ReservationSchema.statics.makeReservation = async function (
  email,
  password,
  seatId
) {
  // check if this user has already made a reservation
  const user = await User.findOne({ email })
  const retrievedUser = await this.findOne({ user })
  if (retrievedUser) {
    throw new Error('You have already made a reservation.')
  }

  // check if this seat has already been reserved
  const seat = await Seat.findOne({ id: seatId })
  const retrievedSeat = await this.findOne({ seat })
  if (retrievedSeat) {
    throw new Error('This seat is already reserved.')
  }

  // compare passwords
  const same = await user.comparePassword(password)
  if (!same) {
    throw new Error('Password incorrect.')
  }

  // create a new reservation insance
  const seatToReserve = await Seat.findOne({ id: seatId })
  const reservation = new this({
    user,
    seat: seatToReserve
  })
  return reservation.save()
}

ReservationSchema.statics.removeAllReservations = function () {
  return this.remove({})
}

module.exports = mongoose.model('Reservation', ReservationSchema)
