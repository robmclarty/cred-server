'use strict'

const TABLE_NAME = 'permissions'

const SELECTABLE_FIELDS = [
  'id',
  'userId',
  'resourceId',
  'actions',
  'updatedAt',
  'createdAt'
]

const CREATABLE_FIELDS = [
  'userId',
  'resourceId',
  'actions'
]

const MUTABLE_FIELDS = [
  'actions'
]

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
  if (validator.isEmpty(String(props.userId))) throw '`userId` is required'
  if (validaotr.isEmpty(String(props.resourceId))) throw '`resourceId` is required'
  if (!validator.isNumeric(String(props.userId))) throw '`userId` must be an integer'
  if (!validator.isNumeric(String(props.resourceId))) throw '`resourceId` must be an integer'
  if (!isArrayOfStrings(props.actions)) throw '`actions` must be an array of srtings'

  return props
}

const create = async props => {
  const filteredProps = filter(props, CREATABLE_FIELDS)
  const saneProps = sanitize(filteredProps)
  const validProps = validate(saneProps)
  const permission = await queries.create(validProps)

  return permission
}

const update = async (id, props) => {
  const filteredProps = filter(props, MUTABLE_FIELDS)
  const saneProps = sanitize(filteredProps)
  const validProps = validate(saneProps)
  const permission = await queries.update(validProps)

  return permission
}

module.exports = {
  tableName: TABLE_NAME,
  fields: SELECTABLE_FIELDS,
  ...queries,
  create, // override queries.create
  update // override queries.update
}
