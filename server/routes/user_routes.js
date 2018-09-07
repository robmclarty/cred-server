'use strict'

const express = require('express')
const router = express.Router()
const {
  postUsers,
  getUsers,
  getUser,
  patchUser,
  deleteUser
} = require('../controllers/user_controller')

router.route('/users')
  .post(postUsers)
  .get(getUsers)

router.route('/users/:id')
  .get(getUser)
  .patch(patchUser)
  .delete(deleteUser)

module.exports = router
