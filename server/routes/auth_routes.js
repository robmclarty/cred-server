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
  .post(postAuth)
  .delete(deleteAuth)

router.route('/auth/refresh')
  .post(refreshAuth)

module.exports = router
