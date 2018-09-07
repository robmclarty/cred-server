'use strict'

const express = require('express')
const router = express.Router()
const {
  postPermissions,
  getPermissions,
  getPermission,
  patchPermission,
  deletePermission
} = require('../controllers/permission_controller')

router.route('/users/:user_id/permissions')
  .post(postPermissions)
  .get(getPermissions)

router.route('/users/:user_id/permissions/:id')
  .get(getPermission)
  .patch(patchPermission)
  .delete(deletePermission)

module.exports = router
