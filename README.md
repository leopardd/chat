# chat

[![Travis](https://img.shields.io/travis/nathaa/chat.svg)](https://travis-ci.org/nathaa/chat)
[![Codecov](https://img.shields.io/codecov/c/github/nathaa/chat.svg)](https://codecov.io/github/nathaa/chat)
[![Software License][https://img.shields.io/badge/license-MIT-brightgreen.svg]](LICENSE.md)

Basic chat

## Getting started

1. Install [Node.js](https://nodejs.org/en/)
2. Install global dependencies: `npm install -g yarn nodemon pm2`
2. Install local dependencies: `yarn`
3. Setup websocket port at `config/index.js`
4. Start

```
// Dev
server: nodemon server.js --watch server.js
client: yarn build.watch

// Prod
server: pm2 start server.js
client: yarn build.prod
```

## Note
- [x] Compatible with all browsers
- [ ] Unit test
- [ ] Browser compatibility test
- [ ] History messages
- [ ] UserIds list on sidebar
- [ ] Production command
- [ ] Setup demo
