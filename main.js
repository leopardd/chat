localStorage.debug = '*'

const debugSocket = require('debug')('main:socket')
const config = require('./config')
const Action = require('./module/Action')
const util = require('./static/util')
const $messageForm = $('#message-form')
const $messageInput = $('#message-input')
const $messages = $('#messages')
const $userId = $('#user-id')
const $spam = $('#spam')
// https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
const scheme = (location.protocol === 'https:') ? 'wss' : 'ws'
const host = `${scheme}://${location.hostname}:${location.port}`
const ws = new WebSocket(host)
const eventKey = config.eventKey
const readyStateKey = config.readyStateKey

// app

// ================================================================ UI

const ui = {
  /**
   * Update userId
   *
   * @param {string}
   */
  userId: id => {
    // ui
    $userId.html(id)
  },

  /**
   * @param {Payload} payload
   */
  addPayload: payload => {
    const $message = $('<div>', {class: 'message'})
    const html = `${util.short(payload.userId)}: ${payload.message}`
    $message.html(html)
    $messages.append($message)
  }
}

// ================================================================ Handle element

$messageForm.submit((e) => {
  e.preventDefault()
  const message = $messageInput.val()
  send(eventKey.message, message)
})

$spam.click((e) => {
  const message = generateLoremSentence()
  send(eventKey.message, message)
})

// ================================================================ Function

function generateLoremSentence() {
  const loremText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in justo in leo pretium pulvinar auctor id libero. Maecenas varius volutpat arcu eget egestas. Fusce at dui at risus cursus accumsan. Aenean sagittis pellentesque justo id fringilla.'
  const sentences = loremText.match(/[^\.!\?]+[\.!\?]+/g);
  const randomIndex = Math.floor(Math.random() * sentences.length)

  return sentences[randomIndex].trim()
}

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
        /** @type {Connected} */
        const connected = action.data

        // ui
        ui.userId(connected.userId)
        connected.payloads.forEach(payload => {
          ui.addPayload(payload)
        })

        break
      case eventKey.newMessage:
        /** @type {Payload} */
        const payload = action.data

        // ui
        ui.addPayload(payload)

        break
      default:
        debugSocket('invalid eventKey', action)
        break
    }
  } catch (e) {
    debugSocket('handle websocket event error', e)
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
