'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.createTable('permissions', t => {
    t.increments('id').primary().unsigned()
    t.integer('user_id').unsigned().index().references('id').inTable('users').onDelete('cascade').onUpdate('cascade')
    t.integer('resource_id').unsigned().index().references('id').inTable('resources').onDelete('restrict').onUpdate('cascade')
    t.json('actions').defaultTo(JSON.stringify([]))
    t.timestamp('created_at').defaultTo(knex.fn.now())
    t.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('permissions')
}
