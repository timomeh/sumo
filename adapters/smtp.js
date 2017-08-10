'use strict'

const GenericAdapter = require('../lib/generic-adapter')
const nodemailer = require('nodemailer')

module.exports = class SMTPAdapter extends GenericAdapter {
  constructor(mails) {
    super(mails)

    this.user = process.env.SMTP_USER
    this.password = process.env.SMTP_PASS
    this.fromEmail = process.env.SMTP_FROM_EMAIL
    this.toEmail = process.env.SMTP_TO_EMAIL
    this.host = process.env.SMTP_HOST
    this.port = process.env.SMTP_PORT != null
                  ? parseInt(process.env.SMTP_PORT)
                  : 465
    this.secure = process.env.SMTP_SECURE != null
                    ? (process.env.SMTP_SECURE === 'true')
                    : true
    this.subject = process.env.SMTP_MAIL_SUBJECT || 'Scheduled sumo notification'
    this.greeting = process.env.SMTP_MAIL_GREETING ||
      'Hi!<br><br>Summary of your Inbox:<br><br>'

    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: this.secure,
      auth: {
        user: this.user,
        pass: this.password
      }
    })
  }

  run() {
    const message = this.generateMessage()

    const mailOptions = {
      from: this.fromEmail,
      to: this.toEmail,
      subject: this.subject,
      text: message,
      html: message
    }

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) return reject(error)
        resolve()
      })
    })
  }

  generateMessage() {
    const table = '<table border="0" style="border-spacing:0;border-collapse: collapse">'
     + '<tr><td style="font-weight:bold">From</td><td style="font-weight:bold">Subject</td><td style="font-weight:bold">Date</td></tr>\n'
      + this.generateMailsInTable()
      + '</table><br><br>'
    const date = `Generated at ${(new Date()).toString()}`

    return this.greeting + table + date
  }

  generateMailsInTable() {
    return this.mails.reduce((accumulator, mail) => {
      return (accumulator || '')
        + `<tr><td style="padding-right:10px">${mail.headers.get('from').text}</td>`
        + `<td style="padding-right:10px">${mail.headers.get('subject')}</td>`
        + `<td style="padding-right:10px">${mail.headers.get('date')}</td></tr>\n`
    }, 0)
  }
}
