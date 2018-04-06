const { MONGOOSE_CHECK_IN_DEV } = require('./consts')

const Seat = require('./models/seat')

const mongoose = require('mongoose')
const SEATS_NUM = 132

function generateSeats () {
  mongoose.connect(MONGOOSE_CHECK_IN_DEV)
  Seat.find({}).then(seats => {
    if (seats.length !== SEATS_NUM) {
      // generate seats only if they do not match `SEATS_NUM`
      Seat.removeAllSeats().then(res => {
        for (let i = 0; i < SEATS_NUM; i++) {
          const id = i + 1
          if (i % 6 === 0 || i % 6 === 5) {
            // window
            const seat = new Seat({
              fee: 10,
              id
            })
            seat.save()
          } else if (i % 6 === 1 || i % 6 === 4) {
            // middle
            const seat = new Seat({
              fee: 0,
              id
            })
            seat.save()
          } else if (i % 6 === 2 || i % 6 === 3) {
            // aisle
            const seat = new Seat({
              fee: 5,
              id
            })
            seat.save()
          }
        }
      })
    }
    console.log(seats)
  })
}

module.exports = generateSeats
