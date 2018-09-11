'use strict'

const Permission = require('../models/permission')
const Resource = require('../models/resource')

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
const changePermissions = async (userId, newActions) => {
  // If no actions are provided, or not formatted properly, return empty array.
  if (!newActions || newActions === Object(newActions))) return []

  const resourceNames = Object.keys(newActions)

  return resourceNames.reduce((userPermissions, resourceName) => {
    const resource = await Resource.findOne({ name: resourceName })

    // If there is no resource found with the provided name, simply return an
    // object containing information on the error, but continue execution,
    // updating any other, valid, permissions. Invalid names will simply be
    // skipped and it will be up to the requestor to handle this type of error.
    if (!resource) return {
      ...userPermissions,
      [resourceName]: {
        name: resourceName,
        actions: newActions[resourceName],
        error: `There is no resource named '${ resourceName }'`
      }
    }

    const existingPermission = await Permission.findOne({
      userId,
      resourceId: resource.id
    })

    const updatedPermission = existingPermission ?
      Permission.update(existingPermission.id, {
        actions: newActions[resourceName]
      }) :
      Permission.create({
        userId,
        resourceId: resource.id,
        actions: newActions[resourceName]
      })

    return {
      ...userPermissions,
      [resourceName]: updatedPermission.actions
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

    return {
      ...userPermissions,
      [resource.name]: permission.actions
    }
  }, {})
}

// Return a new array which merges oldActions[] with newActions[] without
// duplicates.
const addActions = (actions = [], newActions = []) => {
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

module.exports = {
  changePermissions,
  findUserPermissions,
  addActions,
  removeActions
}
