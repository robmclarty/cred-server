'use strict'

const User = require('../models/user')
const {
  createError,
  BAD_REQUEST
} = require('../helpers/error_helper')
const {
  changePermissions,
  findUserPermissions
} = require('../helpers/permission_helper')

// POST /users
// **ADMIN ONLY**
// Create new users directly. This is different from "registration".
//
// NOTE: Users may be created with a `permissions` object containing specific
// permissions for this user against specific resources, however any resources-
// permissions that are defined will OVERRIDE and REPLACE any existing values
// (e.g., in the case of new user creation, there may have been a previous
// version of a "permission" in the DB with certain actions. Those actions will
// be replaced by any that are provided here.
// e.g.,
// If the following was sent as inpput:
// ```
// {
//   username: 'Rob',
//   password: 'my-pass',
//   email: 'rob@email.com',
//   permissions: {
//     myResource: ['action1', 'action2', 'action3'],
//     anotherResource: ['action1', 'action2']
//   }
// }
// ```
// Then permissions for both `myResource` and `anotherResource` (for this user)
// would have all of their permissible actions replaced with the ones provided
// here. If no permissions previously existed, new ones will be created. If no
// resource matches the names provided, an error will be thrown saying so.
//
// IMPORTANT: Only admins are allowed to modify a user's permissions.
const postUsers = async (req, res, next) => {
  if (!req.body.user) return next(createError({
    status: BAD_REQUEST,
    message: '`user` is required'
  }))

  try {
    const {
      permissions: newActions,
      ...userInput
    } = req.body.user
    const user = await User.create(userInput)
    const changedPermissions = user.isAdmin ?
      await changePermissions(user.id, newActions) :
      {}
    const userWithPermissions = {
      ...user,
      permissions: changedPermissions
    }

    res.json({
      ok: true,
      message: 'User created',
      user: userWithPermissions
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
    const usersWithPermissions = users.map(user => ({
      ...user,
      permissions: await findUserPermissions(user.id)
    })

    res.json({
      ok: true,
      message: 'Users found',
      users: usersWithPermissions
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
    const userWithPermissions = {
      ...user,
      permissions: await findUserPermissions(user.id)
    }

    res.json({
      ok: true,
      message: 'User found',
      user: userWithPermissions
    })
  } catch (err) {
    next(err)
  }
}

// PATCH /users/:id
// **ADMIN or OWNER ONLY**
//
// NOTE: Similar to the `create()` function, updating a user with an included
// `permissions` object can be used to replace any permissible actions for this
// user for the specified resources.
//
// IMPORTANT: Only admins are allowed to modify a user's permissions.
const patchUser = async (req, res, next) => {
  if (!req.body.user) return next(createError({
    status: BAD_REQUEST,
    message: '`user` is required'
  }))

  try {
    const {
      permissions: newActions,
      ...userInput
    } = req.body.user
    const user = await User.update(req.params.id, userInput)
    const userPermissions = await findUserPermissions(user.id)
    const changedPermissions = user.isAdmin ?
      await changePermissions(user.id, newActions) :
      {}
    const userWithPermissions = {
      ...user,
      permissions: {
        ...userPermissions,
        ...changedPermissions // override old permissions with new values
      }
    }

    res.json({
      ok: true,
      message: 'User updated',
      user: userWithPermissions
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
