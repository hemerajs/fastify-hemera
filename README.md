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
fastify.register(require('fastify-hemera'), {
  plugins: [require('hemera-mongo-store')],
  hemera: {
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
$ curl http://localhost:3000/reply?a=33&b=22
```

## Examples

Simple

```js
fastify.route({
  method: 'GET',
  url: '/math/add',
  handler: (req, reply) => {
    reply.act({ topic: 'math', cmd: 'add', a: req.query.a, b: req.query.b })
  }
})
```

Async / Await

```js
fastify.route({
  method: 'GET',
  url: '/math/add',
  handler: async function (req, reply) {
    let resp = await req.hemera.act({ topic: 'math', cmd: 'add', a: req.query.a, b: req.query.b })
    // access result
    resp.data
    // retain parent context
    resp = resp.context.act(...)
  }
})
```

## Test

Testsuite makes use of [hemera-testsuite](https://github.com/hemerajs/hemera-testsuite), so your setup should meet it's prerequisits, esp.:

A nats server must be installed on your machine [nats.io](https://nats.io/download/nats-io/nats-server/) and executable as `gnatsd`. So add `nats-server` as `gnatsd` to your `PATH` as alias, link whatever works. Check if it's available:

```sh
$ gnatsd --help

Usage: nats-server [options]

[...]
```

Now test should succeed by running:

```sh
$ yarn test
```