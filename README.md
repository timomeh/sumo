# sumo

> For those mails which aren't important, but you need to keep an eye on them.

sumo is a productivity tool, which logs into your mail account and checks new mails in a directory (or Gmail label). If it sees new mails, it marks them as read and sends you a summary of those new mails. Currently the only notification adapter is SMTP, but it is possible to add more adapters! 🎉

This works perfect with mailbox filters for mails, which are unimportant (or even Spam), but sometimes there are a few important mails.

In my case, I get a lot of Spam to the email address in the WHOIS of my domains. But sometimes important mails can get delivered to that email address, like mails from ICANN. Now I have an email alias "mymailaccount+hostmaster@gmail.com" listed in my WHOIS, and a Gmail filter, which archives and labels mails delivered to that address.

## Usage, the very simple way

Deploy it to a free Heroku Dyno: [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

The configurations are already added via environment variables, you just have to adapt them for your mail account.

Then, configure the Heroku Scheduler, when your mails should be checked.

That's it.

## Usage, the manual way

1. Clone this repository
2. `npm install`
3. `npm start` runs the worker and exits
4. You need a scheduler, which runs `npm start` every few days or how you like it

### Requirements

- Node (a newer version)
- npm (5 would be good)
- A scheduler would be great

# Contribute

More Adapters would be great. Everything is possible. Slack, Telegram, Fax, you name it.

Add a new Adapter to `/adapters` (see `/adapters/smpt.js` for an example) and register it in `/lib/send-to-adapter.js`.

If you need to provide customizable data, use environment variables.

Example:

```js
// adapters/fancy-thing.js

'use strict'

const GenericAdapter = require('../lib/generic-adapter')

module.exports = class SMTPAdapter extends GenericAdapter {
  constructor(mails) {
    super(mails)
  }

  run() {
    // this.mails is an array of all new mails as mailparser headers:
    // https://nodemailer.com/extras/mailparser/

    const firstFrom = this.mails[0].headers.get('from').text
    const firstSubject = this.mails[0].headers.get('subject')
    const firstDate = this.mails[0].headers.get('date')

    // ...and now send them somewhere!
  }
}
```
