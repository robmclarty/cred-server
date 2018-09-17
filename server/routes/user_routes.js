'use strict'

const express = require('express')
const router = express.Router()
const {
  requireAdmin,
  requireOwner
} = require('../middleware/authz_middleware')
const {
  postUsers,
  fetUsers,
  getUser,
  patchUser,
  deleteUser
} = require('../controllers/user_controller')

router.route('/users')
  .post(requireAdmin, postUsers)
  .get(requireAdmin, getUsers)

router.route('/users/:user_id')
  .get(requireOwner, getUser)
  .patch(requireOwner, patchUser)
  .delete(requireOwner, deleteUser)

module.exports = router
