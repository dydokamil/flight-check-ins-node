const request = require('supertest')

const { SEATS_NUM } = require('../generateSeats')
const User = require('../models/user')

const app = require('../app')

describe('reservation REST', () => {
  const userData = {
    email: 'user@user.com',
    password: 'test'
  }

  const seat = 1

  it('should create a user and make a reservation', () => {
    return request(app)
      .post('/users')
      .send({ email: userData.email })
      .send({ password: userData.password })
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.body).toBe(userData.email)

        return request(app)
          .post('/reservations')
          .send({ email: userData.email })
          .send({ password: userData.password })
          .send({ seat })
          .then(response => {
            expect(response.body.user.email).toEqual(userData.email)
          })
      })
  })
})
