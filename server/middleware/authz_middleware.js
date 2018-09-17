'use strict'

const {
  createError,
  UNAUTHORIZED
} = require('../helpers/error_helper')
const {
  IS_ADMIN,
  CAN_MODIFY_PERMISSIONS
} = require('../constants/permission_constants')
const {
  isOwner,
  isAdmin
} = require('../helpers/authz_helper')
const Permission = require('../models/permission')

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
