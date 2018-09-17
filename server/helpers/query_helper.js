'use strict'

const knex = require('../knex')

// Convert any `attrs` of `props` which are JSON object strings into parsed
// JS objects.
const jsonToArrays = props => {

  return {
    ...props,
    actions: props.actions ?
      JSON.parse(props.actions) :
      []
  }
}

// Convert any `attrs` of `props` which are arrays into JSON object strings.
const arraysToJson = props => {
  return Object.keys(props).reduce((formattedProps, key) => {
    formattedProps[key] = Array.isArray(props[key]) ?
      JSON.stringify(props[key]) :
      props[key]

    return formattedProps
  }, {})
}

// Create generic query functions for database that can be used by any table.
module.exports = (tableName, selectableFields = '*') => {
  const find = async filters => await knex.select(selectableFields)
    .from(tableName)
    .where(filters)
    //.then(rows => rows.map(row => jsonToArrays(row)))

  const findAll = async () => find({})

  const findOne = async filters => knex.first(selectableFields)
    .from(tableName)
    .where(filters)
    //.then(row => jsonToArrays(row))

  const findById = async id => knex.first(selectableFields)
    .from(tableName)
    .where({ id })
    //.then(row => jsonToArrays(row))

  const create = async props => knex.insert(arraysToJson(props))
    .into(tableName)
    .returning(selectableFields)
    .then(([result]) => result) // Return first element of returned array.
    //.then(rows => jsonToArrays(rows[0]))

  const update = async (id, props) => knex.update(arraysToJson(props))
    .from(tableName)
    .where({ id })
    .returning(selectableFields)
    .then(([result]) => result) // Return first element of returned array.
    //.then(rows => jsonToArrays(rows[0]))

  const destroy = async id => knex.del()
    .from(tableName)
    .where({ id })

  const destroyAll = async filters => knex.del()
    .from(tableName)
    .where(filters)

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
