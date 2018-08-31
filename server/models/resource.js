'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Resource'
const tableName = 'resources'

const selectableProps = [
  'id',
  'name',
  'url',
  'actions',
  'is_active',
  'updated_at',
  'created_at'
]

module.exports = knex => {
  const guts = createGuts({
    knex,
    name,
    tableName,
    selectableProps
  })

  return {
    ...guts
  }
}
