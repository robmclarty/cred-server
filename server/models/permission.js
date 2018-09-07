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
  if (validator.isEmpty(String(props.user_id))) throw '`user_id` is required'
  if (validaotr.isEmpty(String(props.resource_id))) throw '`resource_id` is required'
  if (!validator.isNumeric(String(props.user_id))) throw '`user_id` must be an integer'
  if (!validator.isNumeric(String(props.resource_id))) throw '`resource_id` must be an integer'
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
