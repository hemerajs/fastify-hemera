'use strict'

const t = require('tap')
const test = t.test
const ts = require('hemera-testsuite')
const build = require('./example')

let fastify = null
let server = null
const port = 4234

t.tearDown(() => {
  fastify.close(() => server.kill())
})

test('boot server', t => {
  server = ts.start_server(port, err => {
    t.error(err)
    fastify = build({
      hemera: {
        logLevel: 'error'
      },
      plugins: [],
      nats: 'nats://127.0.0.1:' + port,
      logger: {
        level: 'error'
      }
    })
    t.end()
  })
})

test('reply decorator', t => {
  t.plan(1)

  fastify.inject(
    {
      method: 'GET',
      url: '/reply?a=1&b=2'
    },
    (err, res) => {
      const payload = JSON.parse(res.payload)
      t.deepEqual(payload, { result: 3 })
    }
  )
})

test('fastify decorator', t => {
  t.plan(1)

  fastify.hemera.act({ topic: 'math', cmd: 'add', a: 1, b: 2 }).then(result => {
    t.deepEqual(result.data, { result: 3 })
  })
})

test('request decorator', t => {
  t.plan(1)

  fastify.inject(
    {
      method: 'GET',
      url: '/request?a=1&b=2'
    },
    (err, res) => {
      const payload = JSON.parse(res.payload)
      t.deepEqual(payload, { result: 3 })
    }
  )
})
