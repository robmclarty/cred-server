'use strict'

const express = require('express')
const router = express.Router()
const cred = require('../cred')
const {
  postAuth,
  refreshAuth,
  deleteAuth
} = require('../controllers/auth_controller')

router.route('/auth')
  .post(cred.authenticate('basic'), postAuth)
  .delete(cred.requireRefreshToken, deleteAuth)

router.route('/auth/refresh')
  .post(cred.requireRefreshToken, refreshAuth)

module.exports = router
