'use strict'

// This obviously doens't do much, but it creates a context for the knex
// instance so that other modules can include the same instance.
// Originally used this file to switch between environments, but just going to
// use the env vars to choose the appropriate configuration.
const knexfile = require('../knexfile')
const knex = require('knex')(knexfile)

module.exports = knex
