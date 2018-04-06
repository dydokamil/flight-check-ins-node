const mongoose = require('mongoose')

const { MONGOOSE_CHECK_IN_DEV } = require('../consts')
const User = require('../models/user')
const Seat = require('../models/seat')
const Reservation = require('../models/reservation')

describe('mongoose Schema', () => {
  const userData = {
    email: 'user2@user.com',
    password: 'test'
  }

  beforeAll(async () => {
    // await User.removeAllUsers()
    // await Reservation.removeAllReservations()
    await mongoose.connect(MONGOOSE_CHECK_IN_DEV)
  })

  beforeEach(() => {
    // User.
  })

  afterEach(async () => {
    await User.removeAllUsers()
    await Reservation.removeAllReservations()
  })

  afterAll(() => {
    mongoose.disconnect()
  })

  it('should create a user and make a reservation', () => {
    const seatNum = 2

    return User.createUser(userData.email, userData.password).then(email => {
      expect(email).toBeDefined()
      return User.findOne({ email }).then(user => {
        expect(user.email).toBeDefined()
        return Seat.findOne({ id: 1 }).then(seat => {
          expect(seat._id).toBeDefined()
          return Reservation.makeReservation(
            userData.email,
            userData.password,
            seatNum
          ).then(reservation => {
            expect(reservation.user.toJSON()).toEqual(user.toJSON())
          })
        })
      })
    })
  })
})
