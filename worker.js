'use strict'

const IMAP = require('./lib/promised-imap')
const sendToAdapter = require('./lib/send-to-adapter')

const config = {
  user: process.env.IMAP_USER,
  password: process.env.IMAP_PASS,
  host: process.env.IMAP_HOST,
  port: process.env.IMAP_PORT != null ? parseInt(process.env.IMAP_PORT) : 993,
  tls: process.env.IMAP_TLS != null ? (process.env.IMAP_TLS === 'true') : true,
  mailbox: process.env.IMAP_MAILBOX,
  search: ['UNSEEN'],
  adapter: process.env.SUMO_ADAPTER || 'SMTP'
}

const imap = new IMAP({
  user: config.user,
  password: config.password,
  host: config.host,
  port: config.port,
  tls: config.tls
})

imap
  .connect()
  .then(() => imap.openBox(config.mailbox))
  .then(() => imap.search(config.search))
  .then(uids => {
    if (uids.length) return imap.getMails(uids)
    return []
  })
  .then(mails => {
    imap.close()

    if (mails.length) return sendToAdapter(config.adapter, mails)
    return
  })
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
