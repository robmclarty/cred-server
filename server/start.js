#!/usr/bin/env node

'use strict'

const config = require('../config/server')
const app = require('./')

app.listen(config.port, () => {
  console.log(`Server started on port ${ config.port }`)
}).on('error', err => {
  console.log('ERROR: ', err)
})
