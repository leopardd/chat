localStorage.debug = '*'

const debugSocket = require('debug')('main:socket')
const faker = require('faker')
const config = require('./config')
const Action = require('./module/Action')
const util = require('./static/util')
const $messageForm = $('#message-form')
const $messageInput = $('#message-input')
const $messages = $('#messages')
const $userId = $('#user-id')
const $spam = $('#spam')
const host = `ws://localhost:${config.port}`
const ws = new WebSocket(host)
const eventKey = config.eventKey
const readyStateKey = config.readyStateKey

// app
let userId = ''

// ================================================================ Handle element

$messageForm.submit((e) => {
  e.preventDefault()
  const message = $messageInput.val()
  send(eventKey.message, message)
})

$spam.click((e) => {
  const message = faker.lorem.sentence()
  send(eventKey.message, message)
})

// ================================================================ Function

/**
 * @param {string} key
 * @param {string} data
 * @param {function} successCb
 * @param {function} errorCb
 */
function send (key, data, successCb, errorCb) {
  if (!ws || ws.readyState !== readyStateKey.open) return false

  try {
    const action = new Action(key, data)
    const actionStr = JSON.stringify(action)
    ws.send(actionStr)
    debugSocket('send ok', action)
    if (successCb) successCb()
  } catch (e) {
    if (e) debugSocket('send error', e)
    if (errorCb) errorCb()
  }
}

// ================================================================ WebSocket

/** @type {MessageEvent} */
ws.onmessage = (messageEvent) => {
  const actionStr = messageEvent.data

  try {
    /** @type {Action} */
    const action = JSON.parse(actionStr)

    switch (action.key) {
      case eventKey.userConnect:
        // update
        userId = action.data

        // ui
        $userId.html(userId)

        // log
        debugSocket('eventKey.userConnect', action.data)
        break
      case eventKey.newMessage:
        /** @type {Payload} */
        const payload = action.data

        // ui
        const $message = $('<div>', {class: 'message'})
        const html = `${util.short(payload.userId)}: ${payload.message}`
        $message.html(html)
        $messages.append($message)

        // log
        debugSocket('eventKey.newMessage', action.data)
        break
      default:
        debugSocket('Invalid eventKey', action)
        break
    }
  } catch (e) {
    debugSocket('Handle websocket event error', e)
  }
}

/** @type {CloseEvent} */
ws.onclose = (e) => {
  debugSocket('ws.onclose', e)
}

/** @type {Event} */
ws.onopen = (e) => {
  debugSocket('ws.onopen', e)
}

ws.onerror = (e) => {
  debugSocket('ws.onerror', e)
}
