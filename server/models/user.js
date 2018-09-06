'use strict'

const knex = require('../knex')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { isArray } = require('./validation_helper')

const TABLE_NAME = 'users'

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
const MUTABLE_FIELDS = [
  'username',
  'email',
  'password',
  'is_active'
]

// Bcrypt functions used for hashing password and later verifying it.
const SALT_ROUNDS = 10
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

const findAll = async () => knex.select(SELECTABLE_FIELDS)
  .from(TABLE_NAME)

const findById = async id => knex.select(SELECTABLE_FIELDS)
  .from(TABLE_NAME)
  .where({ id })

const find = async filters => knex.select(SELECTABLE_FIELDS)
  .from(TABLE_NAME)
  .where(filters)

// Same as `find` by only returns the first match if length > 1.
const findOne = async filters => {
  const users = await find(filters)

  if (!isArray(users)) return users

  return users[0]
}

const create = async props => {
  try {
    const filteredProps = filter(props, MUTABLE_FIELDS)
    const saneProps = await sanitize(filteredProps)
    const validProps = validate(saneProps)
    const user = await knex.insert(validProps)
      .into(TABLE_NAME)
      .returning(SELECTABLE_FIELDS)

    return user
  } catch (err) {
    throw `Problem creating user: ${ err }`
  }
}

// Do not allow changing `password` through regular update function.
// Do not allow changing of `id`.
const update = async (id, props) => {
  try {
    const filteredProps = filter(props, MUTABLE_FIELDS)
    const saneProps = await sanitize(filteredProps)
    const validProps = await validate(saneProps)
    const user = await knex.update(validProps)
      .from(TABLE_NAME)
      .where({ id })
      .returning(SELECTABLE_FIELDS)

    return user
  } catch (err) {
    throw `Problem updating user: ${ err }`
  }
}

const destroy = async id => knex.del()
  .from(TABLE_NAME)
  .where({ id })

const verify = async (username, password) => {
  const verifyErrorMsg = 'Username or password do not match'

  const user = knex.first()
    .from(TABLE_NAME)
    .where({ username })

  if (!user) throw verifyErrorMsg

  const isMatch = await verifyPassword(password, user.password)

  if (!isMatch) throw verifyErrorMsg

  return filter(user, SELECTABLE_FIELDS)
}

const loginUpdate = async id => {
  const user = await knex.first('id')
    .from(tableName)
    .where({ id })

  return knex.update({ login_at: knex.fn.now() })
    .from(TABLE_NAME)
    .where({ id: user.id })
    .returning(SELECTABLE_FIELDS)
}

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
  findAll,
  find,
  findOne,
  findById,
  create,
  update,
  destroy,
  verify,
  loginUpdate,
  tokenPayload
}
