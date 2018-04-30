const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const Schema = mongoose.Schema

const publicKey = fs.readFileSync(
  path.join(__dirname, '../keys/public_key.pem')
)

const UserSchema = new Schema({
  email: { type: Schema.Types.String, unique: true, required: true },
  password: { type: Schema.Types.String, required: true }
})

function hashPassword (password) {
  return bcrypt.hash(password, 10).then(hash => hash)
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
      .then(user => ({ email: user.email }))
      .catch(err => err)
  })
}

UserSchema.statics.removeAllUsers = function () {
  return this.remove({})
}

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password).then(same => same)
}

UserSchema.statics.verifyToken = function (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) reject(err)
      else resolve(decoded)
    })
  })
}

module.exports = mongoose.model('User', UserSchema)
