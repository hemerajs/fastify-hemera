'use strict'

// eslint-disable-next-line node/no-unpublished-require
const { test } = require('tap')
// eslint-disable-next-line node/no-unpublished-require
const ts = require('hemera-testsuite')
const build = require('./example')

let fastify = null
let server = null
const port = 4234

test('setup', (t) => {
  server = ts.start_server(port, (err) => {
    t.error(err)
    fastify = build({
      plugins: [],
      nats: `nats://127.0.0.1:${port}`
    })
    t.end()
  })
})

test('reply decorator', (t) => {
  t.plan(2)

  fastify.inject(
    {
      method: 'GET',
      url: '/reply?a=1&b=2'
    },
    (err, res) => {
      t.error(err)
      const payload = JSON.parse(res.payload)
      t.deepEqual(payload, { result: 3 })
    }
  )
})

test('fastify decorator', (t) => {
  t.plan(1)

  fastify.hemera
    .act({ topic: 'math', cmd: 'add', a: 1, b: 2 })
    .then((result) => {
      t.deepEqual(result.data, { result: 3 })
    })
    .catch(() => t.fail('should not land in catch'))
})

test('request decorator', (t) => {
  t.plan(2)

  fastify.inject(
    {
      method: 'GET',
      url: '/request?a=1&b=2'
    },
    (err, res) => {
      t.error(err)
      const payload = JSON.parse(res.payload)
      t.deepEqual(payload, { result: 3 })
    }
  )
})

test('teardown', function teardown(t) {
  fastify.close(() => {
    server.kill()
    t.end()
  })
})
