const request = require('supertest')

const app = require('../app')
const { SEATS_NUM } = require('../generateSeats')

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
            const { user } = response.body
            expect(user.email).toEqual(userData.email)

            return request(app)
              .get('/seats/available')
              .set('Accept', 'application/json')
              .then(result => {
                expect(result.body.length).toBe(SEATS_NUM - 1)

                return request(app)
                  .get('/seats/mine')
                  .send({ email: userData.email })
                  .send({ password: userData.password })
                  .set('Accept', 'application/json')
                  .then(result => {
                    expect(result.body.user).toEqual(user._id)
                  })
              })
          })
      })
  })
})
