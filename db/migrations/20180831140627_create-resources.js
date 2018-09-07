'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.createTable('resources', t => {
    t.increments('id').primary().unsigned()
    t.string('name').unique().index()
    t.string('url')
    t.json('actions').defaultTo(JSON.stringify([]))
    t.boolean('isActive').defaultTo(true)
    t.timestamp('createdAt').defaultTo(knex.fn.now())
    t.timestamp('updatedAt').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('resources')
}
