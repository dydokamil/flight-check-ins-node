const request = require('supertest')

const { SEATS_NUM } = require('../generateSeats')

const app = require('../app')

describe('seats REST', function () {
  it('should respond with seats', async () => {
    expect.assertions(1)

    const response = await request(app)
      .get('/seats')
      .set('Accept', 'application/json')

    expect(response.body.length).toBe(SEATS_NUM)
  })
})
