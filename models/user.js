const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: { type: Schema.Types.String, unique: true, required: true },
  password: { type: Schema.Types.String, required: true }
})

function hashPassword (password) {
  return bcrypt.hash(password, 10).then(hash => {
    return hash
  })
}

UserSchema.statics.createUser = function (email, password) {
  const User = this

  return hashPassword(password).then(hash => {
    const user = new User({
      email,
      password: hash
    })
    return user
      .save()
      .then(user => user.email)
      .catch(err => err)
  })
}

UserSchema.statics.removeAllUsers = function () {
  return this.remove({})
}

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password).then(same => same)
}

module.exports = mongoose.model('User', UserSchema)
