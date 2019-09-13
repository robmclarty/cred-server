'use strict'

const {
  createError,
  UNAUTHORIZED,
  FORBIDDEN,
  BAD_REQUEST
} = require('../helpers/error_helper')
const cred = require('../cred')

// If `req.cred` or `req.cred.tokens` are not present, it means that the cred
// middleware failed to authenticate the user. See `/server/cred.js` for details.
// Otherwise, if tokens were generated and attached to `req`, return them in
// the response.
const postAuth = (req, res, next) => {
  if (!req.cred || !req.cred.tokens) return next(createError({
    status: UNAUTHORIZED,
    message: 'Authentication failed'
  }))

  res.json({
    ok: true,
    message: 'Login successful',
    tokens: req.cred.tokens
  })
}

// Given a valid refresh token in the Authorization header, return a new set of
// access + refresh tokens with updated expiration dates.
const refreshAuth = async (req, res, next) => {
  try {
    const freshTokens = await cred.refresh(req.cred.token)

    res.json({
      ok: true,
      message: 'Tokens refreshed',
      tokens: freshTokens
    })
  } catch (err) {
    next(createError({
      status: UNAUTHORIZED,
      message: err
    }))
  }
}

// Revoke the authenticated token provided in the Authorization header,
// effectively "logging out".
// Alternatively, if a `token` attribute is provided in the body, on top of the
// token used in the Authorization header, revoke that token instead. This
// action is only allowed by admin users (having the `isAdmin` property of
// their token payload set to `true`.
const deleteAuth = async (req, res, next) => {
  try {
    const revokedToken = await cred.revoke(req.cred.token)

    res.json({
      ok: true,
      message: 'Logged out',
      revokedToken
    })
  } catch (err) {
    next(createError({
      ok: false,
      status: UNAUTHORIZED,
      message: err
    }))
  }
}

// Create a new user.
const postRegister = async (req, res, next) => {
  if (!req.body.user) return next(createError({
    status: BAD_REQUEST,
    message: '`user` is required'
  }))

  try {
    // Create a new user that is guaranteed not to be an admin.
    const user = await User.create({
      ...req.body.user,
      isAdmin: false
    })

    res.json({
      ok: true,
      message: 'Registration successful',
      user
    })
  } catch (err) {
    next(createError({
      status: BAD_REQUEST,
      message: err
    }))
  }
}

module.exports = {
  postAuth,
  refreshAuth,
  deleteAuth,
  postRegister
}
