'use strict'

const Resource = require('../models/resource')
const {
  createError,
  BAD_REQUEST
} = require('../helpers/error_helper')
const { mergeActions } = require('../helpers/permission_helper')

// POST /resources
// **ADMIN ONLY**
const postResources = async (req, res, next) => {
  const resourceInput = req.body.resource

  if (!resourceInput) return next(createError({
    status: BAD_REQUEST,
    message: '`resource` is required'
  }))

  try {
    // Ensure that default resource actions are included with input.
    resourceInput.actions = mergeActions(resourceInput.actions, DEFAULT_RESOURCE_ACTIONS)

    const resource = await Resource.create(resourceInput)

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
    const numResourcesRemoved = await Resource.destroy(req.params.id)

    res.json({
      ok: true,
      message: 'Resource removed',
      numResourcesRemoved
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
