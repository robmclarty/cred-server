'use strict'

const User = require('../../server/models/user')

exports.seed = (knex, Promise) => knex('users').del()
  .then(() => [
    {
      username: 'admin',
      password: 'password',
      email: 'admin@email.com',
      isAdmin: true
    },
    {
      username: 'first-user',
      password: 'password',
      email: 'firstUser@email.com'
    }
  ])
  .then(newUsers => Promise.all(newUsers.map(user => User.create(user))))
