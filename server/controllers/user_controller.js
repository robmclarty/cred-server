'use strict'

const User = require('../models/user')
const {
  createError,
  BAD_REQUEST
} = require('../helpers/error_helper')
const {
  modifyPermissions,
  findUserPermissions
} = require('../helpers/permission_helper')
const { isAdmin } = require('../helpers/authz_helper')

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
  const userInput = req.body

  if (!userInput) return next(createError({
    status: BAD_REQUEST,
    message: 'No input data provided'
  }))

  if (!userInput.username) return next(createError({
    status: BAD_REQUEST,
    message: '`username` is required'
  }))

  if (!userInput.password) return next(createError({
    status: BAD_REQUEST,
    message: '`password` is required'
  }))

  if (!userInput.email) return next(createError({
    status: BAD_REQUEST,
    message: '`email` is required'
  }))

  try {
    const {
      permissions: permissionsInput,
      ...userProps
    } = userInput
    const user = await User.create(userProps)
    const changedPermissions = await modifyPermissions(user.id, permissionsInput)
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
    const usersWithPermissions = await Promise.all(users.map(async user => {
      const permissions = await findUserPermissions(user.id)

      return {
        ...user,
        permissions
      }
    }))

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
  const userId = req.params.user_id

  try {
    const user = await User.findById(userId)
    const permissions = await findUserPermissions(user.id)
    const userWithPermissions = {
      ...user,
      permissions
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
// Admin can modify permissions, and modify user props like `isAdmin`. Regular
// requestors cannot (e.g., see `user` and `changedPermissions` ternaries).
// NOTE: Similar to the `create()` function, updating a user with an included
// `permissions` object can be used to replace any permissible actions for this
// user for the specified resources.
const patchUser = async (req, res, next) => {
  const userId = req.params.user_id
  const userInput = req.body.user

  if (!userInput) return next(createError({
    status: BAD_REQUEST,
    message: '`user` is required'
  }))

  try {
    const {
      permissions: permInput,
      ...userProps
    } = userInput
    const requesterIsAdmin = isAdmin(req)
    const user = requesterIsAdmin ?
      await User.forceUpdate(userId, userProps) :
      await User.update(userId, userProps)
    const userPermissions = await findUserPermissions(user.id)
    const changedPermissions = requesterIsAdmin ?
      await modifyPermissions(user.id, permissionsInput) :
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
  const userId = req.params.user_id

  try {
    const numUsersRemoved = await User.destroy(userId)
    const numPermsRemoved = await Permission.destroyUserPerms(userId)

    res.json({
      ok: true,
      message: 'User removed',
      numUsersRemoved,
      numPermsRemoved
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
