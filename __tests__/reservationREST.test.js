const request = require('supertest')

const app = require('../app')
const { SEATS_NUM } = require('../generateSeats')
const User = require('../models/user')
const Reservation = require('../models/reservation')

describe('reservation REST', () => {
  const userData = {
    email: 'user@user.com',
    password: 'test'
  }

  afterEach(async () => {
    await User.removeAllUsers()
    await Reservation.removeAllReservations()
  })

  const seat = 1

  it('should create a user and make a reservation, then fail on another one', async () => {
    // create a user
    const userResponse = await request(app)
      .post('/users')
      .send({ email: userData.email })
      .send({ password: userData.password })
      .set('Accept', 'application/json')
    expect(userResponse.body).toBe(userData.email)

    // create a reservation
    const reservationResponse = await request(app)
      .post('/reservations')
      .send({ email: userData.email })
      .send({ password: userData.password })
      .send({ seat })
    const { user } = reservationResponse.body
    expect(user.email).toEqual(userData.email)

    // get available seats
    const responseAvailable = await request(app)
      .get('/seats/available')
      .set('Accept', 'application/json')
    expect(responseAvailable.body.length).toBe(SEATS_NUM - 1)

    // get my seats
    const mineResponse = await request(app)
      .get('/seats/mine')
      .send({ email: userData.email })
      .send({ password: userData.password })
      .set('Accept', 'application/json')
    expect(mineResponse.body.user).toEqual(user._id)

    // try to make another reservation and fail
    const anotherReservation = await request(app)
      .post('/reservations')
      .send({ email: userData.email })
      .send({ password: userData.password })
      .send({ seat: seat + 1 })
    expect(anotherReservation.body).toMatchSnapshot()
  })
})
