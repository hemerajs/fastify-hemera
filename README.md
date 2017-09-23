# fastify-hemera
[![Build Status](https://travis-ci.org/hemerajs/fastify-hemera.svg?branch=master)](https://travis-ci.org/hemerajs/fastify-hemera)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](#badge)
[![NPM version](https://img.shields.io/npm/v/fastify-hemera.svg?style=flat)](https://www.npmjs.com/package/fastify-hemera)

[Fastify](https://github.com/fastify/fastify) plugin to integrate [Hemera](https://github.com/hemerajs/hemera)

## Install
```bash
npm install --save fastify-hemera
```

## Register plugin
```js
fastify.register(require("fastify-hemera"), {
    plugins: [{
      register: require('hemera-mongo-store'),
      options: {}
    }],
    hemera:{
      name: 'test',
      logLevel: 'debug'
    },
    nats: 'nats://localhost:4242'
})
```

Full list of [hemera plugins](https://github.com/hemerajs/hemera#packages)

## Getting Started

```bash
$ docker-compose up
$ node example.js
```

```
GET http://localhost:3000/reply?a=33&b=22
```