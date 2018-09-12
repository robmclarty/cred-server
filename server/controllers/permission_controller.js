'use strict'

const Permission = require('../models/permission')
const {
  createError,
  BAD_REQUEST
} = require('../helpers/error_helper')
const {
  addPermissions,
  reducePermissions,
  modifyPermissions,
  findUserPermissions
} = require('../helpers/permission_helper')

// POST /users/:user_id/permissions
// Create/update multiple permissions at once by providing an object where each
// attribute is an array of permissible actions for a resource. Actions for
// that user's permissions on that resource will be REPLACED by the new values.
// This is the same functionality as is used on the `/users` endpoints if
// `permissions` are included in the input data, however in this case, only
// for permissions.
// ```
// {
//   myResource: ['action1', 'action2', 'action3'],
//   anotherResource: ['action1', 'action3']
// }
// ```
const postPermissions = async (req, res, next) => {
  const userId = req.params.user_id
  const permInput = req.body.permissions

  if (!permInput) return next(createError({
    status: BAD_REQUEST,
    message: '`permissions` is required'
  }))

  try {
    const permissions = await modifyPermissions(userId, permInput)

    res.json({
      ok: true,
      message: 'Permissions modified',
      permissions
    })
  } catch (err) {
    next(err)
  }
}

// GET /users/:user_id/permissions
const getPermissions = async (req, res, next) => {
  const userId = req.params.user_id

  try {
    const permissions = await findUserPermissions(userId)

    res.json({
      ok: true,
      message: 'Permissions found',
      permissions
    })
  } catch (err) {
    next(err)
  }
}

// PATCH /users/:user_id/permissions
// Similar interface to the POST function above, however instead of replacing
// existing values, new values will be APPENDED to existing values (without
// duplicates) and new permissions will also be created if they don't already
// exist for a particular resource.
const patchPermissions = async (req, res, next) => {
  const userId = req.params.user_id
  const permInput = req.body.permissions

  if (!permInput) return next(createError({
    status: BAD_REQUEST,
    message: '`permissions` is required'
  }))

  try {
    const oldPerms = await findUserPermissions(userId)
    const permUpdates = addPermissions(oldPerms, permInput)
    const permissions = await modifyPermissions(userId, permUpdates)

    res.json({
      ok: true,
      message: 'Permissions updated',
      permissions
    })
  } catch (err) {
    next(err)
  }
}

// DELETE /users/:user_id/permissions
// The opposite of the PATCH function above; any action values provided will
// be removed from each permission, but remaining action values will be left
// untouched.
const deletePermissions = async (req, res, next) => {
  const userId = req.params.user_id
  const permInput = req.body.permissions

  if (!permInput) return next(createError({
    status: BAD_REQUEST,
    message: '`permissions` is required'
  }))

  try {
    const oldPerms = await findUserPermissions(userId)
    const permUpdates = reducePermissions(oldPerms, permInput)
    const permissions = await modifyPermissions(userId, permUpdates)

    res.json({
      ok: true,
      message: 'Permissions updates',
      permissions
    })
  } catch (err) {
    next(err)
  }
}

// GET /users/:user_id/permissions/:id
// Will get an individual permission object for this user/resource.
const getPermission = async (req, res, next) => {
  const permissionId = req.params.id

  try {
    const permission = await Permission.findById(permissionId)

    res.json({
      ok: true,
      message: 'Permission found',
      permission
    })
  } catch (err) {
    next(err)
  }
}

// PATCH /users/:user_id/permissions/:id
// Will replace values already present with new values.
// {
//   actions: ['action1', 'action2', 'action3']
// }
const patchPermission = async (req, res, next) => {
  const permissionId = req.params.id
  const permInput = req.body.permission

  if (!permInput) return next(createError({
    status: BAD_REQUEST,
    message: '`permission` is required'
  }))

  try {
    const permission = await Permission.update(permissionId, permInput)

    res.json({
      ok: true,
      message: 'Permission updated',
      permission
    })
  } catch (err) {
    next(err)
  }
}

// DELETE /users/:user_id/permissions/:id
// Will completely remove this permission from the user.
const deletePermission = async (req, res, next) => {
  const permissionId = req.params.id

  try {
    const permission = await Permission.destroy(permissionId)

    res.json({
      ok: true,
      message: 'Permission removed',
      permission
    })
  } catch (err) {
    next(err)
  }
}

// POST /permissions
const postAdminPermissions = async (req, res, next) => {
  const permInput = req.body.permission

  try {
    const permission = Permission.create(permInput)

    res.json({
      ok: true,
      message: 'Permission created',
      permission
    })
  } catch (err) {
    next(err)
  }
}

// GET /permissions
const getAdminPermissions = async (req, res, next) => {
  try {
    const permissions = Permission.findAll()

    res.json({
      ok: true,
      message: 'Permissions found',
      permissions
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  postPermissions,
  getPermissions,
  patchPermissions,
  deletePermissions,
  getPermission,
  patchPermission,
  deletePermission,
  adminPostPermissions,
  adminGetPermissions
}
