'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', t => {
    t.increments('id').primary().unsigned()
    t.string('username').unique().index()
    t.string('password')
    t.string('email').unique().index()
    t.boolean('isActive').defaultTo(true)
    t.boolean('isAdmin').defaultTo(false)
    t.timestamp('loginAt').defaultTo(knex.fn.now())
    t.timestamp('createdAt').defaultTo(knex.fn.now())
    t.timestamp('updatedAt').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
}
