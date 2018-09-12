'use strict'

const IS_ADMIN = 'admin'
const CAN_MODIFY_PERMISSIONS = 'permissions:modify'

const DEFAULT_RESOURCE_ACTIONS = [
  IS_ADMIN,
  CAN_MODIFY_PERMISSIONS
]

module.exports = {
  IS_ADMIN,
  CAN_MODIFY_PERMISSIONS,
  DEFAULT_RESOURCE_ACTIONS
}
