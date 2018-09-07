'use strict'

const express = require('express')
const router = express.Router()
const { requireAdmin } = require('../middleware/authz_middleware')
const {
  postResources,
  getResources,
  getResource,
  patchResource,
  deleteResource
} = require('../controllers/resource_controller')

router.route('/resources')
  .post(requireAdmin, postResources)
  .get(getResources)

router.route('/resources/:id')
  .get(getResource)
  .patch(requireAdmin, patchResource)
  .delete(requireAdmin, deleteResource)

module.exports = router
