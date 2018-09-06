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
  .post(postTokens)
  .delete(deleteTokens)

router.route('/auth/refresh')
  .post(refreshTokens)

module.exports = router
