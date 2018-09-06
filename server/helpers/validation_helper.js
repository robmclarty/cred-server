'use strict'

const validator = require('validator')

const isUrlSafe = value => validator.matches(value, /^[A-Za-z0-9\-_@.]+$/))

const isArray = arr => Array.isArray(arr)

const isArrayOfStrings = arr => {
  let isOnlyStrings = true

  arr.forEach(item => {
    if (typeof item !== 'string') {
      isOnlyStrings = false
      break
    }
  })

  return isOnlyStrings
}

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
