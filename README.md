# chat

[![Travis](https://img.shields.io/travis/jojoee/bahttext.svg)](https://travis-ci.org/jojoee/bahttext)
[![Codecov](https://img.shields.io/codecov/c/github/jojoee/bahttext.svg)](https://codecov.io/github/jojoee/bahttext)

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
