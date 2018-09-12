'use strict'

const express = require('express')
const router = express.Router()
const {
  requireAdmin,
  requireOwner
} = require('../middleware/authz_middleware')
const {
  adminPostUsers,
  adminGetUsers,
  getUser,
  patchUser,
  deleteUser,
  adminPatchUser
} = require('../controllers/user_controller')

router.route('/users')
  .post(requireAdmin, adminPostUsers)
  .get(requireAdmin, adminGetUsers)

router.route('/users/:user_id')
  .get(requireOwner, getUser)
  .patch(requireOwner, patchUser)
  .delete(requireOwner, deleteUser)

router.route('/users/:user_id/admin')
  .patch(requireAdmin, adminPatchUser)

module.exports = router
