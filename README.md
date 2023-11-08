# chat

[![Travis](https://img.shields.io/travis/leopardd/chat.svg)](https://travis-ci.org/leopardd/chat)
[![Codecov](https://img.shields.io/codecov/c/github/leopardd/chat.svg)](https://codecov.io/github/leopardd/chat)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE.md)

Basic chat

## Getting started

1. Install [Node.js](https://nodejs.org/en/)
2. Install dependencies: `npm install`
3. Setup config `config/index.js`
4. Start

```bash
# Dev
npm run build.watch
nodemon server.js --watch server.js

# Prod, server
npm run build.prod
node server.js

# ENV
NODE_ENV=development
DEBUG=*
```

## Note
- [x] Compatible with all browsers
- [ ] Automated scripts: unit test
- [ ] Automated scripts: browser compatibility test
- [ ] Automated scripts: E2E
- [ ] Automated scripts: deploy to production
- [ ] History messages
- [ ] User list on sidebar
