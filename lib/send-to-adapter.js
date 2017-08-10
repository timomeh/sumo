'use strict'

const adapters = {
  SMTP: require('../adapters/smtp')
}

module.exports = (adapterType, mails) => {
  const adapter = new adapters[adapterType](mails)
  return adapter.run()
}
