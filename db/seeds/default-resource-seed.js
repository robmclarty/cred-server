'use strict'

// NOTE: Running this seed requires defining two environment variables:
// 1. APP_NAME (used as default resource name)
// 2. ISSUER (used as both `iss` token attribute and default `aud` attribute)
const Resource = require('../../server/models/resource')
const config = require('../../config/server')

exports.seed = (knex, Promise) => knex('resources').del()
  .then(() => Resource.create({
    name: config.name,
    url: config.issuer,
    actions: [],
    isActive: true
  }))
