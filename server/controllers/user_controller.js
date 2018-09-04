'use strict'

// POST /users
const postUsers = async (req, res, next) => {
  try {
    const input = await UserHelper.filterProps(req.body.user)
    const user = await Queries.create(input)

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
const getUsers = (req, res, next) => {
}

// GET /users/:id
const getUser = (req, res, next) => {
}

// PATCH /users/:id
const patchUser = (req, res, next) => {
}

// DELETE /users/:id
const deleteUser = (req, res, next) => {
}

module.exports = {
  postUsers,
  getUsers,
  getUser,
  patchUser,
  deleteUser
}
