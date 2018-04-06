const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: { type: Schema.Types.String, unique: true, required: true },
  password: { type: Schema.Types.String, required: true }
})

module.exports = mongoose.model('Seat', UserSchema)
