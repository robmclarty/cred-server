'use strict'

const Permission = require('../models/permission')
const Resource = require('../models/resource')

// Return a new array which merges actions[] with newActions[] without
// duplicates.
const mergeActions = (actions = [], newActions = []) => {
  const uniqueActions = newActions.filter(action => !actions.includes(action))

  return [...actions, ...uniqueActions]
}

// Return a new array containing only the elements in actions[] which do not
// match any of the elements in removedActions[].
const removeActions = (actions = [], removedActions = []) => {
  return removedActions.reduce((remainingActions, action) => {
    const index = remainingActions.indexOf(action)

    return [
      ...remainingActions.slice(0, index),
      ...remainingActions.slice(index + 1)
    ]
  }, [...actions])
}

// Expects objects to be flat, each attribute corresponding to a resource name,
// with a value which is an array of permissible actions.
// Returns a new object which includes only the `newPerms` merged with `perms`.
const addPermissions = (perms = {}, newPerms = {}) => {
  const resourceNames = Object.keys(newPerms)

  return resourceNames.reduce((udpates, name) => {
    const actions = perms[name] ?
      mergeActions(perms[name], newPerms[name]) :
      newPerms[name]

    return {
      ...updates,
      [name]: actions
    }
  }, {})
}

// Expects objects to be flat, each attribute corresponding to a resource name,
// with a value which is an array of permissible actions.
// Returns a new object which includes only the remaining `perms` that had
// `newPerms` removed from them.
// If a resource does not exist, just skip it.
const reducePermissions = (perms = {}, newPerms = {}) => {
  const resourceNames = Object.keys(newPerms)

  return resourceName.reduce((updates, name) => {
    if (!perms[name]) return updates

    const actions = removeActions(perms[name], newPerms[name])

    return {
      ...updates,
      [name]: actions
    }
  }, {})
}

const createOrUpdatePermission = async (userId, resourceName, actions = []) => {
  const resource = await Resource.findOne({ name: resourceName })

  if (!resource) return {} // do nothing

  const permission = await Permission.findOne({
    userId,
    resourceId: resource.id
  })
  const validActions = actions.filter(action => resource.actions.includes(action))

  return permission ?
    Permission.update(permission.id, {
      actions: validActions
    }) :
    Permission.create({
      userId,
      resourceId: resource.id,
      actions: validActions
    })
}

// A convenience function for assigning/updating user permissions at the same
// time as a user is being created/updated. More granular permission controls
// are available through the `/users/:user_id/permissions` endpoints.
//
// Assumes `newActions` is an object containing named attributes which
// themselves are arrays of strings.
// e.g.,
// ```
// {
//   myResource: ['action1', 'action2', 'action3'],
//   anotherResource: ['action1', 'action2']
// }
// ```
const modifyPermissions = async (userId, newPerms = {}) => {
  // If no actions are provided, or not formatted properly, return empty array.
  if (!newPerms || newPerms !== Object(newPerms)) return []

  const resourceNames = Object.keys(newPerms)

  return resourceNames.reduce(async (userPerms, name) => {
    const updatedPerm = await createOrUpdatePermission(userId, name, userPerms[name])

    // If there is no resource found with the provided name, simply return an
    // object containing information on the error, but continue execution,
    // updating any other, valid, permissions. Invalid names will simply be
    // skipped and it will be up to the requestor to handle this type of error.
    if (!updatedPerm) return {
      ...userPerms,
      [name]: {
        name,
        actions: newPerms[name],
        error: `There is no resource named '${ name }'`
      }
    }

    return {
      ...userPerms,
      [name]: updatedPerm.actions
    }
  }, {})
}

// Find all permissions for a given `userId` and return them formatted as an
// object where each attribute of the object is an array of actions labelled by
// their corresponding resource name.
const findUserPermissions = async userId => {
  const resources = await Resource.findAll()
  const permissions = await Permission.find({ userId })

  return permissions.reduce((userPermissions, permission) => {
    const resource = resources.find(r => r.id === permission.resourceId)

    if (!resource) return userPermissions

    return {
      ...userPermissions,
      [resource.name]: permission.actions
    }
  }, {})
}

module.exports = {
  createOrUpdatePermission,
  modifyPermissions,
  findUserPermissions,
  mergeActions,
  removeActions,
  addPermissions,
  reducePermissions
}
