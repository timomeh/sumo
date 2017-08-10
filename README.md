# sumo

> For those mails which aren't important, but you still want to keep an eye on them.

sumo is a productivity tool, which checks your mail account for new mails in a specific directory (or Gmail label). If it sees new mails, it marks them as read and sends you a summary of those new mails. Currently the only adapter to send that summary is SMTP, so it basically sends you a Mail. But it is easy to contribute and add more adapters! 🎉

A mail containing a list of new mails? **This may sound silly, but it really isn't.**

This works perfect with mailbox filters for new mails, which are unimportant (or even Spam), but sometimes there are a few important mails. Read more in [Background](#background).

## Table of Contents

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:0 orderedList:0 -->

- [Background](#background)
- [Usage, the very simple way](#usage-the-very-simple-way)
- [Usage, the manual way](#usage-the-manual-way)
	- [Requirements](#requirements)
- [More useful Informations](#more-useful-informations)
	- [Usage with Gmail](#usage-with-gmail)
	- [Want to check more inboxes / directories / labels?](#want-to-check-more-inboxes-directories-labels)
- [Contribute](#contribute)
- [License](#license)

<!-- /TOC -->

## Background

In my case, I get a lot of spam to the email address, which is listed in the WHOIS of my domains. But sometimes important mails can get delivered to that email address, like mails from [ICANN](https://www.icann.org/). With sumo, I can use an email alias like "mymailaccount+hostmaster@gmail.com" in my WHOIS, and configure an appropriate Gmail filter, which archives and labels mails delivered to that address. Now those mails don't distract me, but once a week I get a summary and can see if I got an important mail between all those spam mails.

## Usage, the very simple way

1. Deploy it to a free Heroku Dyno:  
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
2. Fill out the necessary environment variables.
3. Configure the Heroku Scheduler to call `npm start` whenever you'd like to.

Hint: If you want to run the Scheduler every few days, choose _Daily_, the desired time, and use something like this:

```bash
if [ "$(date +%u)" = 3 ]; then npm start; fi
```

… where `3` is the third day of the week, Wednesday. Then it will only be executed on a Wednesday. 🙃

## Usage, the manual way

1. Clone this repository
2. `npm install`
3. `npm start` runs the worker and exits.
4. You need a scheduler, which runs `npm start` on your behalf every few days or however you like it

### Requirements

- Node (a newer version)
- npm (5 would be good)
- A scheduler would be great

## More useful Informations

### Usage with Gmail

If you want to use sumo with your Gmail Account, you need to create an [App password](https://myaccount.google.com/apppasswords). Your Google password won't work.

### Want to check more inboxes / directories / labels?

Simply deploy more instances. 🙂

## Contribute

Feel free to contribute! 🚀 More Adapters would be great. Everything is possible. Slack, Telegram, Fax, you name it.

1. Add a new file to `/adapters` (see `/adapters/smpt.js` for an example)
2. Register it in `/lib/send-to-adapter.js`
3. Set the `SUMO_ADATER` environment variable to your new registered adapter.

If you need to provide customizable data, use environment variables.

Example:

```js
// lib/send-to-adapter.js
'use strict'

const adapters = {
  SMTP: require('../adapters/smtp'),
  FANCY: require('../adapters/fancy-thing') // <- this is your new adapter!
                                            // To use it, set the env variable
                                            // SUMO_ADATER to FANCY
}

// ... No need to modify things below.
```

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

    // ...and now send this to some service!
  }
}
```

## License

[MIT](LICENSE) © Timo Mämecke
