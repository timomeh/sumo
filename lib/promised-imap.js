'use strict'

const NodeIMAP = require('imap')
const mailparser = require('mailparser').simpleParser
const parse = require('mailparser').simpleParser

module.exports = class IMAP {
  constructor(auth) {
    this.imap = new NodeIMAP(auth)
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', () => resolve())
      this.imap.once('error', (error) => reject(error))
      this.imap.connect()
    })
  }

  openBox(boxName) {
    return new Promise((resolve, reject) => {
      this.imap.openBox(boxName, false, (error, mailbox) => {
        if (error) return reject(error)
        resolve(mailbox)
      })
    })
  }

  search(query) {
    return new Promise((resolve, reject) => {
      this.imap.search(query, (error, uids) => {
        if (error) return reject(error)
        resolve(uids)
      })
    })
  }

  getMails(uids) {
    const mails = []
    const fetchOpts = {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true,
      markSeen: true
    }

    return new Promise((resolve, reject) => {
      const fetcher = this.imap.fetch(uids, fetchOpts)

      // Store each message as string
      fetcher.on('message', (mailStream, seqno) => {
        let mailHeader = ''
        mailStream.on('body', (dataStream) => {
          dataStream.on('data', buffer => mailHeader += buffer.toString())
        })
        mailStream.on('end', () => mails.push(mailHeader))
      })

      // Process mail headers
      fetcher.once('end', () => {
        this._parseMails(mails)
          .then((parsedMails) => resolve(parsedMails))
          .catch((error) => reject(error))
      })
    })
  }

  close() {
    this.imap.end()
  }

  // private

  _parseMails(mails) {
    const parsingMails = mails.map(mailHeader => parse(mailHeader))
    return Promise.all(parsingMails)
  }
}
