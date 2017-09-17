require('dotenv').config()
const debugSocket = require('debug')('server:socket')
const debugInterval1 = require('debug')('server:interval1')
const WebSocket = require('ws')
const uuid = require('uuid/v1')
const config = require('./config')
const Action = require('./module/Action')
const port = config.port
const eventKey = config.eventKey
const readyStateKey = config.readyStateKey
const oneSec = 1000

/** @type {string[]} */
let userIds = []

// ================================================================ Function

/**
 * @param {Object} ws
 * @param {string} key
 * @param {string} data
 * @param {function} successCb
 * @param {function} errorCb
 */
function send (ws, key, data, successCb, errorCb) {
  if (ws.readyState !== readyStateKey.open) return false

  const action = new Action(key, data)
  const actionStr = JSON.stringify(action)
  ws.send(actionStr, (e) => {
    if (e) {
      debugSocket(e)
      if (errorCb) errorCb()
    } else {
      if (successCb) successCb()
    }
  })
}

/**
 * Generate unique playerId based on timestamp
 */
function getRandomUserId () {
  let isExisting = true
  let newId
  while (isExisting) {
    newId = uuid()
    if (userIds.indexOf(newId) < 0) {
      isExisting = false
    }
  }

  return newId
}

/**
 * @param {string} userId
 */
function removeUser (userId) {
  const index = userIds.indexOf(userId)
  if (index > -1) userIds.splice(index, 1)
}

function forEachClient (func) {
  wss.clients.forEach((ws) => {
    if (ws.readyState === readyStateKey.open) {
      func(ws)
    }
  })
}

// ================================================================ App

const wss = new WebSocket.Server({
  port: port
}, () => {
  debugSocket('Server start on port', port)
})

/**
 * @todo refactor
 */
wss.on('connection', (ws) => {
  ws.on('message', (actionStr) => {
    try {
      const action = JSON.parse(actionStr)
      switch (action.key) {
        case eventKey.message:
          const message = action.data

          // broadcast
          forEachClient((ws) => {
            send(ws, eventKey.newMessage, message)
          })

          // log
          debugSocket(`User {ws.id}: {message}`)
          break
        default:
          debugSocket('Invalid action', action)
          break
      }
    } catch (e) {
      debugSocket('Handle websocket event error', e)
    }
  })

  ws.on('close', (e) => {
    // remove
    removeUser(ws.id)

    // log
    debugSocket(`userId: ${ws.id} is disconnected`)
  })

  // create new
  const newUserId = getRandomUserId()
  userIds.push(newUserId)
  ws.id = newUserId
  // send userId to user
  send(ws, eventKey.userConnect, newUserId)
})

// ================================================================ setInterval

setInterval(() => {
  // log
  debugInterval1('n users', userIds.length)
}, oneSec)
