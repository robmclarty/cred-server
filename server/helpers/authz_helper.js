'use strict'

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
  req.cred.payload.permissions.includes(IS_ADMIN)

module.exports = {
  isOwner,
  isAdmin
}
