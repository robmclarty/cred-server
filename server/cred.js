'use strict'

const { readFileSync } = require('fs')
const gotCred = require('cred')
const config = require('../config/server')
const User = require('./models/user')
const Permission = require('./models/permission')
const Resource = require('./models/resource')
const { ADMIN_PERMISSION } = require('./constants/model_constants')

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

const tokenPayload = async (resource, user) => {
  const permission = await Permission.findOne({
    userId: user.id,
    resourceId: resource.id
  })

  // If user is not active, return an empty array of permission actions.
  const actions = permission ?
    permission.actions :
    []

  // If user is an admin, add the admin permission actions.
  if (user.isAdmin) actions.push(ADMIN_PERMISSION)

  // Use `resource.url` as the token's audience attribute as it uniquely
  // identifies the resource for which permissions are being issued.
  return {
    aud: resource.url,
    permissions: actions,
    userId: user.id
  }
}

// If no `aud` is provided, use a default aud/url (e.g., to this resource/issuer).
cred.use('basic', async req => {
  const username = String(req.body.username)
  const password = String(req.body.password)
  const aud = String(req.body.aud || config.issuer)

  if (!username && !email) throw '`username` is required'
  if (!password) throw '`password` is required'

  const user = await User.verify(username, password)
    .then(u => User.loginUpdate(u.id))
  const resource = await Resource.findOne({ url: aud })

  return tokenPayload(resource, user)
})

module.exports = cred
