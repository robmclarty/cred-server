'use strict'

const bcrypt = require('bcrypt')
const createGuts = require('../helpers/model-guts')

const name = 'User'
const tableName = 'users'

// Properties that are allowed to be selected from the database for reading.
// (e.g., `password` is not included and thus cannot be selected)
const selectableProps = [
  'id',
  'username',
  'email',
  'phone',
  'isActive',
  'isAdmin',
  'facebookId',
  'githubId',
  'twitterId',
  'googleId',
  'loginAt',
  'updatedAt',
  'createdAt'
]

const tokenPayload = user => ({
  userId: user.id,
  username: user.username,
  isActive: user.isActive,
  isAdmin: user.isAdmin,
  permissions: tokenPermissions(user.permissions)
})

// Bcrypt functions used for hashing password and later verifying it.
const SALT_ROUNDS = 10
const hashPassword = password => bcrypt.hash(password, SALT_ROUNDS)
const verifyPassword = (password, hash) => bcrypt.compare(password, hash)

// Always perform this logic before saving to db. This includes always hashing
// the password field prior to writing so it is never saved in plain text.
const beforeSave = user => {
  if (!user.password) return Promise.resolve(user)

  // `password` will always be hashed before being saved.
  return hashPassword(user.password)
    .then(hash => ({ ...user, password: hash }))
    .catch(err => `Error hashing password: ${ err }`)
}

module.exports = knex => {
  const guts = createGuts({
    knex,
    name,
    tableName,
    selectableProps
  })

  // Augment default `create` function to include custom `beforeSave` logic.
  const create = props => beforeSave(props)
    .then(user => guts.create(user))

  const update = props => {
    // TODO: get user data (or at least password) here somehow
    const hasChangedPassword = props.password && verifyPassword(props.password, user.password)
    const hashedProps = hasChangedPassword ? beforeSave(props) : props

    return guts.update(hashedProps.id, hashedProps)
  }

  const verify = (username, password) => {
    const matchErrorMsg = 'Username or password do not match'

    return knex.select()
      .from(tableName)
      .where({ username })
      .timeout(guts.timeout)
      .then(user => {
        if (!user) throw matchErrorMsg

        return user
      })
      .then(user => Promise.all([user, verifyPassword(password, user.password)]))
      .then(([user, isMatch]) => {
        if (!isMatch) throw matchErrorMsg

        return user
      })
  }

  const loginUpdate = id => {
    return knex.select('id')
      .from(tableName)
      .where({ id })
      .timeout(guts.timeout)
      .then(user => update({
        id: user.id,
        loginAt: knex.fn.now()
      }))
  }

  const updatePermission = (id, resource, actions) => {
  }

  const updatePermissions = (id, permissions) => {
  }

  const deletePermission = (id, resourceName) => {
  }

  const tokenPayload = id => {
  }

  const toJSON = id => {
  }

  return {
    ...guts,
    create,
    update,
    verify,
    tokenPayload
  }
}
