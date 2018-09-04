'use strict'

module.exports = ({
  knex = {},
  name = 'name',
  tableName = 'table-name',
  fields = [],
  timeout = 1000
}) => {
  const create = props => {
    delete props.id // not allowed to set `id`

    return knex.insert(props)
      .returning(fields)
      .into(tableName)
      .timeout(timeout)
  }

  const findAll = () => knex.select(fields)
    .from(tableName)
    .timeout(timeout)

  const find = filters => knex.select(fields)
    .from(tableName)
    .where(filters)
    .timeout(timeout)

  // Same as `find` but only returns the first match if >1 are found.
  const findOne = filters => find(filters)
    .then(results => {
      if (!Array.isArray(users)) return results

      return results[0]
    })

  const findById = id => knex.select(fields)
    .from(tableName)
    .where({ id })
    .timeout(timeout)

  const update = (id, props) => {
    delete props.id // not allowed to set `id`

    return knex.update(props)
      .from(tableName)
      .where({ id })
      .returning(fields)
      .timeout(timeout)
  }

  const destroy = id => knex.del()
    .from(tableName)
    .where({ id })
    .timeout(timeout)

  return {
    name,
    tableName,
    fields,
    timeout,
    create,
    findAll,
    find,
    findOne,
    findById,
    update,
    destroy
  }
}
