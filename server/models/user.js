'use strict'

const TABLE_NAME = 'users'
const SALT_ROUNDS = 10 // how many rounds used for password hash salt

// Properties that are allowed to be selected from the database for reading.
// (e.g., `password` is not included and thus cannot be selected)
const SELECTABLE_FIELDS = [
  'id',
  'username',
  'email',
  'phone',
  'is_active',
  'is_admin',
  'login_at',
  'updated_at',
  'created_at'
]

// Properties that are allowed to be modified.
const MUTABLE_FIELDS = [
  'username',
  'email',
  'password',
  'is_active'
]

const knex = require('../knex')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { isArray } = require('./validation_helper')
const queries = require('../helpers/query_helper')(TABLE_NAME, SELECTABLE_FIELDS)

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
  if (!validator.matches(props.username, /a-z0-9/i)) throw '`username` must be format a-z and 0-9'
  if (validator.isEmpty(props.email)) throw '`email` is required'
  if (!validator.isEmail(props.email)) throw '`email` must be a valid email address'
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

  const user = await queries.findOne({ username })

  if (!user) throw verifyErrorMsg

  const isMatch = await verifyPassword(password, user.password)

  if (!isMatch) throw verifyErrorMsg

  return user
}

const loginUpdate = async id => queries.update(id, {
  login_at: knex.fn.now()
})

// TODO: not sure how this hooks up to permissions yet
const tokenPayload = (user, permissions) => ({
  user_id: user.id,
  username: user.username,
  is_active: user.is_active,
  is_admin: user.is_admin,
  permissions: tokenPermissions(permissions)
})

module.exports = {
  tableName: TABLE_NAME,
  fields: SELECTABLE_FIELDS,
  ...queries,
  create, // override default
  update, // override default
  verify,
  loginUpdate,
  tokenPayload
}
