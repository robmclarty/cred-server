'use strict'

const express = require('express')
const router = express.Router()
const {
  requireAdmin,
  requireOwner,
  requireModifyPermission
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
  .post(requireModifyPermission, postPermissions)
  .get(requireOwner, getPermissions)
  .patch(requireModifyPermission, patchPermissions)
  .delete(requireModifyPermission, deletePermissions)

router.route('/users/:user_id/permissions/:permission_id')
  .get(requireOwner, getPermission)
  .patch(requireModifyPermission, patchPermission)
  .delete(requireModifyPermission, deletePermission)

module.exports = router
