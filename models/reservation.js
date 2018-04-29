const mongoose = require('mongoose')
const moment = require('moment')

const { BASE_PRICE, CHECK_IN_FEE } = require('../consts')
const User = require('./user')
const Seat = require('./seat')

const Schema = mongoose.Schema

const ReservationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  seat: { type: Schema.Types.ObjectId, ref: 'Seat' },
  reservedUntil: { type: Date },
  paid: { type: Schema.Types.Boolean, default: false }
})

ReservationSchema.statics.getSeatsAndReservations = async function (token) {
  let reservedSeats = await this.find({
    reservedUntil: { $gte: moment.utc() }
  })
    .select('seat -_id')
    .lean()

  reservedSeats = reservedSeats.map(reservedSeat => reservedSeat.seat)
  reservedSeats = await Seat.find({
    _id: { $in: reservedSeats }
  })

  let notReservedSeats = await Seat.find({
    _id: {
      $nin: reservedSeats
    }
  }).lean()

  notReservedSeats = notReservedSeats.map(notReservedSeat => ({
    ...notReservedSeat,
    available: true
  }))

  return { reservedSeats, notReservedSeats }
}

ReservationSchema.statics.makeRandomReservation = async function (email) {
  const { notReservedSeats } = await this.getSeatsAndReservations()

  const seatId = Math.round(Math.random() * notReservedSeats.length - 1)

  return new Promise(async (resolve, reject) => {
    const res = await this.makeReservation(email, seatId, true)
    if ('error' in Object.keys(res)) reject(res.error)
    else resolve(res)
  })
}

ReservationSchema.statics.makeReservation = async function (
  email,
  seatId,
  discount = false
) {
  // check if this user has already made a reservation
  console.log(email)
  const user = await User.findOne({ email })
  if (!user) throw new Error('User not found!')
  const reservationForUser = await this.findOne({
    user,
    reservedUntil: {
      $gte: moment.utc()
    }
  })
  if (reservationForUser) {
    return { error: 'You have already made a reservation.' }
  }
  const seat = await Seat.findOne({ id: seatId })
  if (!seat) return { error: 'Seat not found!' }

  // check if this seat has already been reserved
  const reservationForSeat = await this.findOne({
    seat,
    reservedUntil: {
      $gte: moment.utc()
    }
  })
  if (reservationForSeat) {
    return { error: 'This seat is already reserved.' }
  }

  // create a new reservation insance
  const seatToReserve = await Seat.findOne({ id: seatId })
  const reservation = new this({
    user,
    seat: seatToReserve,
    reservedUntil: moment.utc().add(3, 'minutes')
  })

  let price = BASE_PRICE + seat.fee
  price += discount ? 0 : CHECK_IN_FEE

  return reservation.save().then(res => ({
    _id: res._id,
    paid: res.paid,
    price,
    reservedUntil: res.reservedUntil,
    seat: res.seat
  }))
}

ReservationSchema.statics.removeAllReservations = function () {
  return this.remove({})
}

module.exports = mongoose.model('Reservation', ReservationSchema)
