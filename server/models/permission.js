'use strict'

const validator = require('validator')
const {
  notEmptyOrInList,
  isArray,
  isArrayOfStrings
} = require('../helpers/validation_helper')
const {
  jsonToArrays,
  arraysToJson,
} = require('../helpers/actions_helper')

const TABLE_NAME = 'permissions'

const SELECTABLE_FIELDS = [
  'id',
  'user_id',
  'resource_id',
  'actions',
  'updated_at',
  'created_at'
]
const CREATABLE_FIELDS = [
  'user_id',
  'resource_id',
  'actions'
]
const MUTABLE_FIELDS = [
  'actions'
]

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
}

const find = async filters => knex.select(SELECTABLE_FIELDS)
  .from(TABLE_NAME)
  .where(filters)
  .then(permissions => permissions.map(p => jsonToArrays(p)))

const findAll = async () => find({})

const findOne = async filters => find(filters)[0]

const findById = async id => find({ id })[0]
