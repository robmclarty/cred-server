'use strict'

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE || 'postgres://localhost:5432/cred-server',
  migrations: {
    tableName: 'knex_migrations',
    directory: `${ __dirname }/db/migrations`
  },
  seeds: {
    directory: `${ __dirname }/db/seeds`
  }
}
