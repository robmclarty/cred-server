'use strict'

const knex = require('../knex')
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

  // ...not doing anything to the data atm

  return p
}

const validate = props => {
  if (!validator.isURL(props.url)) throw '`url` must be a valid URL'
  if (!validator.isBoolean(props.is_active)) throw '`is_active` must be either true or false'
  if (!isArrayOfStrings(props.actions)) throw '`actions` must be an array of srtings'
}

const find = async filters => knex.select(SELECTABLE_FIELDS)
  .from(TABLE_NAME)
  .where(filters)
  .then(resources => resources.map(r => jsonToArrays(r)))

const findAll = async () => find({})

const findOne = async filters => find(filters)[0]

const findById = async id => find({ id })[0]

const create = async props => {
  try {
    const filteredProps = filter(props, MUTABLE_FIELDS)
    const saneProps = sanitize(filteredProps)
    const validProps = validate(saneProps)
    const resource = await knex.insert(arraysToJson(validProps))
      .into(TABLE_NAME)
      .returning(SELECTABLE_FIELDS)

    return jsonToArrays(resource)
  } catch (err) {
    throw `Problem creating resource: ${ err }`
  }
}

const update = async (id, props) => {
  try {
    const filteredProps = filter(props, MUTABLE_FIELDS)
    const saneProps = sanitize(filteredProps)
    const validProps = validate(saneProps)
    const resource = await knex.update(arraysToJson(validProps))
      .from(TABLE_NAME)
      .where({ id })
      .returning(SELECTABLE_FIELDS)

    return jsonToArrays(resource)
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
