'use strict'

const User = require('../models/user')
const {
  createError,
  BAD_REQUEST
} = require('../helpers/error_helper')

// POST /users
// **ADMIN ONLY**
// Create new users directly. This is different from "registration".
const postUsers = async (req, res, next) => {
  if (!req.body.user) return next(createError({
    status: BAD_REQUEST,
    message: '`user` is required'
  }))

  try {
    const user = await User.create(req.body.user)

    res.json({
      ok: true,
      message: 'User created',
      user
    })
  } catch (err) {
    next(err)
  }
}

// GET /users
// **ADMIN ONLY**
const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll()

    res.json({
      ok: true,
      message: 'Found users',
      users
    })
  } catch (err) {
    next(err)
  }
}

// GET /users/:id
// **ADMIN or OWNER ONLY**
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    res.json({
      ok: true,
      message: 'Found user',
      user
    })
  } catch (err) {
    next(err)
  }
}

// PATCH /users/:id
// **ADMIN or OWNER ONLY**
const patchUser = async (req, res, next) => {
  try {
    const user = await User.update(req.params.id, req.body.user)

    res.json({
      ok: true,
      message: 'User updated',
      user
    })
  } catch (err) {
    next(err)
  }
}

// DELETE /users/:id
// **ADMIN or OWNER ONLY**
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.destroy(req.params.id)

    res.json({
      ok: true,
      message: 'User removed',
      user
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  postUsers,
  getUsers,
  getUser,
  patchUser,
  deleteUser
}
