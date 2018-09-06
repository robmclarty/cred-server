'use strict'

const knex = require('../knex')
const {
  jsonToArrays,
  arraysToJson
} = require('./actions_helper')

// Create generic query functions for database that can be used by any table.
module.exports = (tableName, selectableFields = '*') => {
  const find = async filters => await knex.select(SELECTABLE_FIELDS)
    .from(tableName)
    .where(filters)
    .then(rows => rows.map(row => jsonToArrays(row)))

  const findAll = async () => find({})

  const findOne = async filters => knex.first(SELECTABLE_FIELDS)
    .from(tableName)
    .where(filters)
    .then(row => jsonToArrays(row))

  const findById = async id => knex.first(SELECTABLE_FIELDS)
    .from(tableName)
    .where({ id })
    .then(row => jsonToArrays(row))

  const create = async props => knex.insert(arraysToJson(props))
    .into(tableName)
    .returning(selectableFields)
    .then(rows => jsonToArrays(rows[0]))

  const update = async (id, props) => knex.update(arraysToJson(props))
    .from(tableName)
    .where({ id })
    .returning(selectableFields)
    .then(rows => jsonToArrays(rows[0]))

  const destroy = async id => knex.del()
    .from(tableName)
    .where({ id })

  return {
    find,
    findAll,
    findOne,
    findById,
    create,
    update,
    destroy
  }
}
