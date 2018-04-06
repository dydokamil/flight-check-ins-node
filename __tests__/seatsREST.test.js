const request = require('supertest')

const { SEATS_NUM } = require('../generateSeats')

const app = require('../app')

describe('seats REST', function () {
  it('should respond with seats', function () {
    expect.assertions(1)

    return request(app)
      .get('/seats')
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.body.length).toBe(SEATS_NUM)
      })
  })
})
