'use strict'

const TABLE_NAME = 'resources'

const SELECTABLE_FIELDS = [
  'id',
  'name',
  'url',
  'actions',
  'isActive',
  'updatedAt',
  'createdAt'
]

const MUTABLE_FIELDS = [
  'name',
  'url',
  'actions',
  'isActive'
]

const knex = require('../knex')
const validator = require('validator')
const {
  notEmptyOrInList,
  isArray,
  isArrayOfStrings
} = require('../helpers/validation_helper')
const queries = require('../helpers/query_helper')(TABLE_NAME, SELECTABLE_FIELDS)

// Remove all immutable fields
const filter = (props, keys) => Object.keys(props).reduce((filteredProps, key) => {
  if (keys.includes(key)) filteredProps[key] = props[key]

  return filteredProps
}, {})

const sanitize = props => {
  let p = props

  // ...not doing anything to the data atm

  return p
}

const validate = props => {
  if (!validator.matches(props.name, /^[A-Za-z0-9\-_@.]+$/)) throw '`name` must be url-safe'
  if (!validator.isURL(props.url, {
    require_tld: false,
    allow_underscores: true
  })) throw '`url` must be a valid URL'
  if (!validator.isBoolean(String(props.isActive))) throw '`isActive` must be either true or false'
  if (!isArrayOfStrings(props.actions)) throw '`actions` must be an array of srtings'

  return props
}

const create = async props => {
  const filteredProps = filter(props, MUTABLE_FIELDS)
  const saneProps = sanitize(filteredProps)
  const validProps = validate(saneProps)
  const resource = await queries.create(validProps)

  return resource
}

const update = async (id, props) => {
  const filteredProps = filter(props, MUTABLE_FIELDS)
  const saneProps = sanitize(filteredProps)
  const validProps = validate(saneProps)
  const resource = await queries.update(validProps)

  return resource
}

module.exports = {
  tableName: TABLE_NAME,
  fields: SELECTABLE_FIELDS,
  ...queries,
  create, // override queries.create
  update // override queries.update
}
