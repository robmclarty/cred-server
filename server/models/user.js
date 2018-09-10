'use strict'

const TABLE_NAME = 'users'
const SALT_ROUNDS = 10 // how many rounds used for password hash salt

// Properties that are allowed to be selected from the database for reading.
// (e.g., `password` is not included and thus cannot be selected)
const SELECTABLE_FIELDS = [
  'id',
  'username',
  'email',
  'isActive',
  'isAdmin',
  'loginAt',
  'updatedAt',
  'createdAt'
]

// Properties that are allowed to be modified.
const MUTABLE_FIELDS = [
  'username',
  'email',
  'password',
  'isActive'
]

const knex = require('../knex')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { isArray } = require('../helpers/validation_helper')
const queries = require('../helpers/query_helper')(TABLE_NAME, SELECTABLE_FIELDS)
const Permission = require('./permission')

// Bcrypt functions used for hashing password and later verifying it.
const hashPassword = password => bcrypt.hash(password, SALT_ROUNDS)
const verifyPassword = (password, hash) => bcrypt.compare(password, hash)

// Remove all immutable fields
const filter = (props, keys) => Object.keys(props).reduce((filteredProps, key) => {
  if (keys.includes(key)) filteredProps[key] = props[key]

  return filteredProps
}, {})

const sanitize = async props => {
  let p = props

  if (p.password) p.password = await hashPassword(p.password)
  if (p.email) p.email = validator.normalizeEmail(p.email)

  return p
}

const validate = props => {
  if (validator.isEmpty(props.username)) throw '`username` is required'
  if (!validator.matches(props.username, /^[A-Za-z0-9\-_@.]+$/)) throw '`username` must be url-safe'
  if (validator.isEmpty(props.email)) throw '`email` is required'
  if (!validator.isEmail(props.email)) throw '`email` must be a valid email address'

  return props
}

const create = async props => {
  const filteredProps = filter(props, MUTABLE_FIELDS)
  const saneProps = await sanitize(filteredProps)
  const validProps = validate(saneProps)
  const user = await queries.create(validProps)

  return user
}

// Do not allow changing `password` through regular update function.
// Do not allow changing of `id`.
const update = async (id, props) => {
  const filteredProps = filter(props, MUTABLE_FIELDS)
  const saneProps = await sanitize(filteredProps)
  const validProps = await validate(saneProps)
  const user = await queries.udpate(id, validProps)

  return user
}

const verify = async (username, password) => {
  const verifyErrorMsg = 'Username or password do not match'

  const user = await knex.first([
    ...SELECTABLE_FIELDS,
    'password'
  ])
    .from(TABLE_NAME)
    .where({ username })

  if (!user) throw verifyErrorMsg

  const isMatch = await verifyPassword(password, user.password)

  if (!isMatch) throw verifyErrorMsg

  // Don't include `password` in returned object.
  delete user.password

  return user
}

const loginUpdate = async id => queries.update(id, {
  loginAt: knex.fn.now()
})

module.exports = {
  tableName: TABLE_NAME,
  fields: SELECTABLE_FIELDS,
  ...queries,
  create, // override queries.create
  update, // override queries.update
  verify,
  loginUpdate
}
