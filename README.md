# SEER Plugin for Node.js [![Build Status](https://travis-ci.org/associatedemployers/seer-node.svg?branch=master)](https://travis-ci.org/associatedemployers/seer-node)

For use with SEER platform.

### Installation
```
$ yarn add seer-checks
```

### Usage
Koa & Express are supported. Usage across http frameworks looks pretty much the same.

Koa
```javascript
...
const seer = require('seer-checks')

let myApp = seer(new Koa(), {
  framework: 'koa',
  statusUrl: '/api/v1/__status__', // optional
  debounce: 30000, // debounce checks
  checks: [{
    name: 'some-ping',
    retries: 5, // number of retries allowed
    check: async () => {
      await someCheck();
      // return or throw an error
    }
  }]
})
```

Express
```javascript
...
const seer = require('seer-checks')

let myApp = seer(Express(), {
  framework: 'express',
  statusUrl: '/api/__status__', // optional
  debounce: 30000, // debounce checks
  checks: [{
    name: 'some-ping',
    retries: 5, // number of retries allowed
    check: async () => {
      await someCheck();
      // return or throw an error
    }
  }]
})
```

### Retrieving a status

`GET https://whatever-my-api-is.com/api/__status__/` will return a JSON object. If no checks are passed to the plugin, you get a heartbeat check by default.

```json
{
  "status": "ok",
  "healthy": true,
  "seer-version": "0.0.1"
}
```

If checks have been passed to the plugin, the object will look like:
```json
{
  "status": "ok",
  "healthy": true,
  "seer-version": "0.0.1",
  "checks": {
    "my-check-name": {
      "healthy": false,
      "time": 1230,
      "error": "Some error was thrown"
    },
    "another-check": {
      "healthy": true,
      "time": 400
    }
  }
}
```
