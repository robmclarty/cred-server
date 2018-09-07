'use strict'

const validator = require('validator')

const isUrlSafe = value => validator.matches(value, /^[A-Za-z0-9\-_@.]+$/)

const isArray = arr => Array.isArray(arr)

const isArrayOfStrings = arr => arr.every(item => typeof item === 'string')

const notEmptyOrInList = (value, list) => {
  if (!Array.isArray(list)) return false

  return value !== '' && !list.includes(value)
}

module.exports = {
  isUrlSafe,
  isArray,
  isArrayOfStrings,
  notEmptyOrInList
}
