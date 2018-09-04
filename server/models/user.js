'use strict'

const bcrypt = require('bcrypt')
const validator = require('validator')

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
  'password'
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
  let saneProps = props

  try {
    if (saneProps.password) saneProps.password = await hashPassword(saneProps.password)
    if (saneProps.email) saneProps.email = validator.normalizeEmail(saneProps.email)

    return saneProps
  } catch (err) {
    throw `Problem hashing password: ${ err }`
  }
}

const validate = async props => {
  // username
  if (validator.isEmpty(props.username)) throw '`username` is required'
  if (!validator.matches(props.username, /a-z0-9/i)) throw '`username` must be format a-z and 0-9'

  // email
  if (validator.isEmpty(props.email)) throw '`email` is required'
  if (!validator.isEmail(props.email)) throw '`email` must be a valid email address'
}

const create = async props => {
  try {
    const filteredProps = filter(props, MUTABLE_FIELDS)
    const saneProps = await sanitize(filteredProps)
    const validProps = await validate(saneProps)
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
const update = async props => {
  try {
    const filteredProps = filter(props, MUTABLE_FIELDS)
    const saneProps = await sanitize(filteredProps)
    const validProps = await validate(saneProps)
    const user = await knex.update(validProps)
      .from(TABLE_NAME)
      .where({ id: props.id })
      .returning(SELECTABLE_FIELDS)

    return user
  } catch (err) {
    throw `Problem updating user: ${ err }`
  }
}

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
  userId: user.id,
  username: user.username,
  isActive: user.is_active,
  isAdmin: user.is_admin,
  permissions: tokenPermissions(permissions)
})

module.exports = {
  tableName: TABLE_NAME,
  fields: SELECTABLE_FIELDS,
  create,
  update,
  verify,
  loginUpdate,
  tokenPayload
}
