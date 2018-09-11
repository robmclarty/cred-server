'use strict'

const Resource = require('../models/resource')
const {
  createError,
  BAD_REQUEST
} = require('../helpers/error_helper')

// POST /resources
// **ADMIN ONLY**
const postResources = async (req, res, next) => {
  if (!req.body.resource) return next(createError({
    status: BAD_REQUEST,
    message: '`resource` is required'
  }))

  try {
    const resource = await Resource.create(req.body.resource)

    res.json({
      ok: true,
      message: 'Resource created',
      resource
    })
  } catch (err) {
    next(err)
  }
}

// GET /resources
const getResources = async (req, res, next) => {
  try {
    const resources = await Resource.findAll()

    res.json({
      ok: true,
      message: 'Resources found',
      resources
    })
  } catch (err) {
    next(err)
  }
}

// GET /resources/:id
const getResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id)

    res.json({
      ok: true,
      message: 'Resource found',
      resource
    })
  } catch (err) {
    next(err)
  }
}

// PATCH /resources/:id
// **ADMIN ONLY**
const patchResource = async (req, res, next) => {
  if (!req.body.resource) return next(createError({
    status: BAD_REQUEST,
    message: '`resource` is required'
  }))

  try {
    const resource = await Resource.update(req.params.id, req.body.resource)

    res.json({
      ok: true,
      message: 'Resource updated',
      resource
    })
  } catch (err) {
    next(err)
  }
}

// DELETE /resources/:id
// **ADMIN ONLY**
const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.destroy(req.params.id)

    res.json({
      ok: true,
      message: 'Resource removed',
      resource
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  postResources,
  getResources,
  getResource,
  patchResource,
  deleteResource
}
