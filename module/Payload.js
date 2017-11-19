class Payload {
  /**
   * @param {string} userId
   * @param {string} message
   */
  constructor (userId, message) {
    this.userId = userId
    this.message = message
  }
}

module.exports = Payload
