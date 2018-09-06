'use strict'

const knex = require('../knex')
const validator = require('validator')
const {
  notEmptyOrInList,
  isArray,
  isArrayOfStrings
} = require('./validation_helper')

const TABLE_NAME = 'resources'

const SELECTABLE_FIELDS = [
  'id',
  'name',
  'url',
  'actions',
  'is_active',
  'updated_at',
  'created_at'
]
const MUTABLE_FIELDS = [
  'name',
  'url',
  'actions',
  'is_active'
]

// Remove all immutable fields
const filter = (props, keys) => Object.keys(props).reduce((filteredProps, key) => {
  if (keys.includes(key)) filteredProps[key] = props[key]

  return filteredProps
}, {})

const sanitize = props => {
  let p = props

  try {
    // ...not doing anything to the data atm

    return p
  } catch (err) {
    throw `Problem hashing password: ${ err }`
  }
}

const validate = props => {
  if (!validator.isURL(props.url)) throw '`url` must be a valid URL'
  if (!validator.isBoolean(props.is_active)) throw '`is_active` must be either true or false'
  if (!isArrayOfStrings(props.actions)) throw '`actions` must be an array of srtings'
}

// Return a new array which merges oldActions[] with newActions[] without
// duplicates.
const addActions = (actions = [], newActions = []) => {
  const uniqueActions = newActions.filter(action => !actions.includes(action))

  return [...actions, ...uniqueActions]
}

// Return a new array containing only the elements in actions[] which do not
// match any of the elements in removedActions[].
const removeActions = (actions = [], removedActions = []) => {
  return removedActions.reduce((remainingActions, action) => {
    const index = remainingActions.indexOf(action)

    return [
      ...remainingActions.slice(0, index),
      ...remainingActions.slice(index + 1)
    ]
  }, [...actions])
}

// `actions` is a JSON column in the database, so transform it to JSON string
// before storing in DB.
const encodeForDB = props => ({
  ...props,
  actions: JSON.stringify(props.actions)
})

// `actions` is a JSON column in the database, so parse it to an array when
// retrieving it from the DB.
const decodeFromDB = props => ({
  ...props,
  actions: JSON.parse(props.actions)
})

const findAll = async () => {
  const resources = await knex.select(SELECTABLE_FIELDS)
    .from(TABLE_NAME)

  return resources.map(r => decodeFromDB(r))
}

const findById = async id => {
  const resource = await knex.select(SELECTABLE_FIELDS)
    .from(TABLE_NAME)
    .where({ id })

  return decodeFromDB(resource)
}

const find = async filters => {
  const resources = knex.select(SELECTABLE_FIELDS)
    .from(TABLE_NAME)
    .where(filters)

  return resources.map(r => decodeFromDB(r))
}

// Same as `find` by only returns the first match if length > 1.
const findOne = async filters => {
  const resources = await find(filters)

  if (!isArray(resources)) return resources

  return decodeFromDB(resources[0])
}

const create = async props => {
  try {
    const filteredProps = filter(props, MUTABLE_FIELDS)
    const saneProps = sanitize(filteredProps)
    const validProps = validate(saneProps)
    const resource = await knex.insert(encodeForDB(validProps))
      .into(TABLE_NAME)
      .returning(SELECTABLE_FIELDS)

    return decodeFromDB(resource)
  } catch (err) {
    throw `Problem creating resource: ${ err }`
  }
}

const update = async (id, props) => {
  try {
    const filteredProps = filter(props, MUTABLE_FIELDS)
    const saneProps = sanitize(filteredProps)
    const validProps = validate(saneProps)
    const resource = await knex.update(encodeForDB(validProps))
      .from(TABLE_NAME)
      .where({ id })
      .returning(SELECTABLE_FIELDS)

    return decodeFromDB(resource)
  } catch (err) {
    throw `Problem updating resource: ${ err }`
  }
}

const destroy = async id => knex.del()
  .from(TABLE_NAME)
  .where({ id })

module.exports = {
  tableName: TABLE_NAME,
  fields: SELECTABLE_FIELDS,
  findAll,
  find,
  findOne,
  findById,
  create,
  update,
  destroy
}
