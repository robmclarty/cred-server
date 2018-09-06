'use strict'

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

// `actions` is a JSON column in the database, so transform it to JSON string
// before storing in DB.
const jsonToArrays = props => ({
  ...props,
  actions: JSON.stringify(props.actions)
})

// `actions` is a JSON column in the database, so parse it to an array when
// retrieving it from the DB.
const arraysToJson = props => ({
  ...props,
  actions: JSON.parse(props.actions)
})

module.exports = {
  addActions,
  removeActions,
  jsonToArrays,
  arraysToJson
}
