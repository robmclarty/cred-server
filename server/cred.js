'use strict'

const { readFileSync } = require('fs')
const gotCred = require('cred')
const config = require('../config/server')
const User = require('./models/user')

const cred = gotCred({
  resource: config.name,
  issuer: config.issuer,
  accessOpts: {
    privateKey: readFileSync(config.cred.accessPrivKey),
    publicKey: readFileSync(config.cred.accessPubKey),
    expiresIn: config.cred.accessExpiresIn,
    algorithm: config.cred.accessAlg
  },
  refreshOpts: {
    secret: config.cred.refreshSecret,
    expiresIn: config.cred.refreshExpiresIn,
    algorithm: config.cred.refreshAlg
  }
})

cred.use('basic', req => {
  const username = String(req.body.username)
  const password = String(req.body.password)

  if (!username && !email) throw '`username` is required'
  if (!password) throw '`password` is required'

  return User.verify(username, password)
    .then(user => User.loginUpdate(user.id))
    .then(user => User.tokenPayload(user))
})

module.exports = cred
