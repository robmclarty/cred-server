'use strict'

const express = require('express')
const router = express.Router()
const {
  postResources,
  getResources,
  getResource,
  patchResource,
  deleteResource
} = require('../controllers/resource_controller')

router.route('/resources')
  .post(postResources)
  .get(getResources)

router.route('/resources/:id')
  .get(getResource)
  .patch(patchResource)
  .delete(deleteResource)

module.exports = router
