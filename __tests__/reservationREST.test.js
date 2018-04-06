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
      .post('/seats')
      .field('email', userData.email)
      .field('password', userData.password)
      .field('seat', seat)
      .set('Accept', 'application/json')
      .then(response => {
        console.log(response.body)
        expect(response.body.reservation.user.email).toBe(userData.email)
        expect(response.body).toMatchSnapshot()
      })
  })
})
