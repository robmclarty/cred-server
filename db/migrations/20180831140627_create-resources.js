'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.createTable('resources', t => {
    t.increments('id').primary().unsigned()
    t.string('name').unique().index()
    t.string('url')
    t.json('actions').defaultTo(JSON.stringify([]))
    t.boolean('is_active').defaultTo(true)
    t.timestamp('created_at').defaultTo(knex.fn.now())
    t.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('resources')
}
