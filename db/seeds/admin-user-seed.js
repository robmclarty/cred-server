'use strict'

const { User } = require('../../server/models')

exports.seed = (knex, Promise) => knex('users').del()
  .then(() => [
    {
      username: 'admin',
      password: 'password',
      email: 'admin@email.com'
    },
    {
      username: 'first-user',
      password: 'password',
      email: 'firstUser@email.com'
    }
  ])
  .then(newUsers => Promise.all(newUsers.map(user => User.create())))
