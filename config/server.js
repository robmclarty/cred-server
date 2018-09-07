'use strict'

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  name: process.env.APP_NAME,
  issuer: process.env.ISSUER,
  origin: process.env.ORIGIN,
  cred: {
    accessPrivKey: process.env.CRED_ACCESS_PRIVATE_KEY,
    accessPubKey: process.env.CRED_ACCESS_PUBLIC_KEY,
    accessExpiresIn: process.env.CRED_ACCESS_EXPIRES_IN,
    accessAlg: process.env.CRED_ACCESS_ALGORITHM,
    refreshSecret: process.env.CRED_REFRESH_SECRET,
    refreshExpiresIn: process.env.CRED_REFRESH_EXPIRES_IN,
    refreshAlg: process.env.CRED_REFRESH_ALGORITHM
  }
}
