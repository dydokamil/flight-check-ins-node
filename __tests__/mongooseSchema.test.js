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

  it('should create a user and make a reservation', async () => {
    const seatNum = 2

    const email = await User.createUser(userData.email, userData.password)
    expect(email).toBeDefined()

    const user = await User.findOne({ email })
    expect(user.email).toBeDefined()

    const seat = await Seat.findOne({ id: 1 })
    expect(seat._id).toBeDefined()

    const reservation = await Reservation.makeReservation(
      userData.email,
      userData.password,
      seatNum
    )
    expect(reservation.user.toJSON()).toEqual(user.toJSON())
  })
})
