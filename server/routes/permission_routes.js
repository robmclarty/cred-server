'use strict'

const express = require('express')
const router = express.Router()
const {
  requireAdmin,
  requireOwner,
  canModifyPermission
} = require('../middleware/authz_middleware')
const {
  postPermissions,
  getPermissions,
  patchPermissions,
  deletePermissions,
  getPermission,
  patchPermission,
  deletePermission,
  adminPostPermissions,
  adminGetPermissions
} = require('../controllers/permission_controller')

router.route('/permissions')
  .post(requireAdmin, adminPostPermissions)
  .get(requireAdmin, adminGetPermissions)

router.route('/users/:user_id/permissions')
  .post(requireAdmin, postPermissions)
  .get(requireOwner, getPermissions)
  .patch(requireAdmin, patchPermissions)
  .delete(requireAdmin, deletePermissions)

router.route('/users/:user_id/permissions/:permission_id')
  .get(requireOwner, getPermission)
  .patch(canModifyPermission, patchPermission)
  .delete(canModifyPermission, deletePermission)

module.exports = router
