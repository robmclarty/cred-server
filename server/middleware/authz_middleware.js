'use strict'

const {
  createError,
  UNAUTHORIZED
} = require('../helpers/error_helper')
const {
  IS_ADMIN,
  CAN_MODIFY_PERMISSIONS
} = require('../constants/permission_constants')
const Permission = require('../models/permission')

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

// Authorization requires user be either:
// 1. an admin, or
// 2. have the modify-permissions permission for the associated resource
const requireModifyPermission = async (req, res, next) => {
  const requesterUserId = req.cred.payload.userId
  const permissionId = req.params.permission_id
  const permission = await Permission.findById(permissionId)
  const requesterPermission = await Permission.findOne({
    userId: requesterUserId,
    resourceId: targetPermission.resourceId
  })
  const canModifyPermission = requesterPermission.actions.includes(CAN_MODIFY_PERMISSIONS)

  if (!isAdmin(req) && !canModifyPermission) return next(createError({
    status: UNAUTHORIZED,
    message: 'You are not authorized to access this resource'
  }))

  next()
}

module.exports = {
  requireAdmin,
  requireOwner,
  requireModifyPermission
}
