'use strict'

const express = require('express')
const router = express.Router()
const { requireOwner } = require('../middleware/authz_middleware')
const {
  postPermissions,
  getPermissions,
  getPermission,
  patchPermission,
  deletePermission
} = require('../controllers/permission_controller')

router.route('/users/:user_id/permissions')
  .post(requireOwner, postPermissions)
  .get(requireOwner, getPermissions)

router.route('/users/:user_id/permissions/:id')
  .get(requireOwner, getPermission)
  .patch(requireOwner, patchPermission)
  .delete(requireOwner, deletePermission)

module.exports = router
