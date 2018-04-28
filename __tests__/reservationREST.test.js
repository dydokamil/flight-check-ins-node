const request = require('supertest')

const app = require('../app')
const { SEATS_NUM } = require('../generateSeats')

describe('reservation REST', () => {
  const userData = {
    email: 'user@user.com',
    password: 'test'
  }

  const seat = 1

  it('should create a user and make a reservation', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({ email: userData.email })
      .send({ password: userData.password })
      .set('Accept', 'application/json')

    expect(userResponse.body).toBe(userData.email)

    const reservationResponse = await request(app)
      .post('/reservations')
      .send({ email: userData.email })
      .send({ password: userData.password })
      .send({ seat })

    const { user } = reservationResponse.body
    expect(user.email).toEqual(userData.email)

    const responseAvailable = await request(app)
      .get('/seats/available')
      .set('Accept', 'application/json')

    expect(responseAvailable.body.length).toBe(SEATS_NUM - 1)

    const mineResponse = await request(app)
      .get('/seats/mine')
      .send({ email: userData.email })
      .send({ password: userData.password })
      .set('Accept', 'application/json')

    expect(mineResponse.body.user).toEqual(user._id)
  })
})
