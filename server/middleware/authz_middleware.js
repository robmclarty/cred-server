'use strict'

const {
  createError,
  UNAUTHORIZED
} = require('../helpers/error_helper')
const { ADMIN_PERMISSION } = require('../constants/model_constants')

// Compares the value of the URI param `user_id` to the value of the `userId`
// stored in the authentication token to determine if they match. If the do,
// the token is considerd to "own" the resource being accessed.
const isOwner = req => req.cred &&
  req.cred.payload &&
  req.cred.payload.userId &&
  req.params &&
  req.params.user_id &&
  Number(req.cred.payload.userId) === Number(req.params.user_id)

// Must have `isAdmin` set to `true` on cred token payload object.
const isAdmin = req => req.cred &&
  req.cred.payload &&
  req.cred.payload.permissions &&
  Array.isArray(req.cred.payload.permissions) &&
  req.cred.payload.permissions.includes(ADMIN_PERMISSION)

// NOTE: If user is an "admin" user, they are also considered an "owner".
const requireOwner = (req, res, next) => {
  if (!isAdmin(req) && !isOwner(req)) return next(createError({
    status: UNAUTHORIZED,
    message: 'You are not authorized to access this resource'
  }))

  next()
}

const requireAdmin = (req, res, next) => {
  if (!isAdmin(req)) return next(createError({
    status: UNAUTHORIZED,
    message: 'You are not authrorized to access this resource'
  }))

  next()
}

module.exports = {
  requireAdmin,
  requireOwner
}
