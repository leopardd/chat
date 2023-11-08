require('dotenv').config()
const debugSocket = require('debug')('server:socket')
const debugInterval1 = require('debug')('server:interval1')
const WebSocket = require('ws')
const express = require('express')
const http = require('http')
const uuid = require('uuid/v1')
const config = require('./config')
const Action = require('./module/Action')
const Payload = require('./module/Payload')
const Connected = require('./module/Connected')
const util = require('./static/util')
const port = config.port
const eventKey = config.eventKey
const readyStateKey = config.readyStateKey
const oneSec = 1000

/** @type {string[]} */
let userIds = []
/** @type {string[]} */
let payloads = []
const maxPayloads = 40

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
 *
 * @returns {string}
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

/**
 * @param {function} func
 */
function forEachClient (func) {
  wss.clients.forEach((ws) => {
    if (ws.readyState === readyStateKey.open) {
      func(ws)
    }
  })
}

/**
 * @param {Payload} payload
 */
function savePayload (payload) {
  payloads.push(payload)
  if (payloads.length > maxPayloads) {
    payloads.shift()
  }
}

// ================================================================ App

const app = express()

app.use(express.static('public'))
app.get('/', (req, res) => {
  // response something
})

// Create a server by combining express and ws library via http:
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

server.listen(port, () => {
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

          // save into payloads
          const payload = new Payload(ws.id, message)
          savePayload(payload)

          // broadcast
          forEachClient((ws) => {
            send(ws, eventKey.newMessage, payload)
          })

          // log
          debugSocket(`${util.short(ws.id)}: ${message}`)
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

  ws.on('error', (e) => {
    console.log(e)
    console.log(e.stack)
  })

  // create new
  const newUserId = getRandomUserId()
  userIds.push(newUserId)
  ws.id = newUserId

  // send userId to user
  send(
    ws,
    eventKey.userConnect,
    new Connected(newUserId, payloads)
  )
})

// ================================================================ setInterval

setInterval(() => {
  // log
  debugInterval1(`n users: ${userIds.length}, payloads.length: ${payloads.length}`)
}, oneSec)
