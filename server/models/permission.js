'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Permission'
const tableName = 'permissions'

const selectableProps = [
  'id',
  'user_id',
  'resource_id',
  'actions',
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
