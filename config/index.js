const config = {
  port: 6001,
  eventKey: {
    // client to server
    message: 'message',

    // to specific client
    userConnect: 'userConnect',

    // server to all clients
    newMessage: 'newMessage'
  },
  readyStateKey: {
    connecting: 0,
    open: 1,
    closing: 2,
    closed: 3
  }
}

module.exports = config
