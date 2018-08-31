'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('../config/server')

const app = express()

// Disable X-Powered-By header.
app.disable('x-powered-by')

// Only accept application/json requests.
app.use(bodyParser.json())

// Enable cross-origin resource sharing.
app.use(cors({
  origin: config.origin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}))

// Serve static assets from `/build` folder in dev or test mode.
if (config.env === 'development' || 'test') {
  app.use(express.static(`${ __dirname }/../build`))
}

// app.use('/', [
//   require('./routes/auth_routes'),
//   require('./routes/user_routes'),
//   require('./routes/resource_routes'),
//   require('./routes/permission_routes')
// ])

//app.use(require('./middleware/error_middleware').all)

module.exports = app
