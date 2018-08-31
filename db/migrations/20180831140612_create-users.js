'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', t => {
    t.increments('id').primary().unsigned()
    t.string('username').unique().index()
    t.string('password')
    t.string('email').unique().index()
    t.boolean('is_active').defaultTo(true)
    t.boolean('is_admin').defaultTo(false)
    t.timestamp('login_at').defaultTo(knex.fn.now())
    t.timestamp('created_at').defaultTo(knex.fn.now())
    t.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
}
