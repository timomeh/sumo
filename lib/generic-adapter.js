'use strict'

module.exports = class GenericAdapter {
  constructor(mails) {
    this.mails = mails
  }

  run() {
    throw new Error('Your Adapter needs to implement the `run` method.')
  }
}
