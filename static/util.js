/**
 * @returns {string} 6 length of str
 */
function short (str) {
  const returnedLength = 6
  if (str && str.length > returnedLength) {
    return `${str.substr(1, 4)}..`
  }
}

module.exports = {
  short
}
