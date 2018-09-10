'use strict'

const express = require('express')
const router = express.Router()
const cred = require('../cred')
const {
  postAuth,
  refreshAuth,
  deleteAuth,
  postRegister
} = require('../controllers/auth_controller')

router.route('/auth')
  .post(cred.authenticate('basic'), postAuth)
  .delete(cred.requireRefreshToken, deleteAuth)

router.route('/auth/refresh')
  .post(cred.requireRefreshToken, refreshAuth)

// TODO: implement some additional protections for this endpoint such as
// rate-limiting.
router.route('/register')
  .post(postRegister)

module.exports = router
