'use strict'

const t = require('tap')
const test = t.test
const ts = require('hemera-testsuite')
const build = require('./example')

let fastify = null
let server = null
const port = 3439

const myPlugin = function myPlugin(hemera, options, done) {
  done()
}

myPlugin[Symbol.for('dependencies')] = []
myPlugin[Symbol.for('name')] = 'myPlugin'
myPlugin[Symbol.for('options')] = { a: 1 }

const plugins = [myPlugin]

t.tearDown(() => {
  fastify.close(() => server.kill())
})

test('boot server', t => {
  server = ts.start_server(port, err => {
    t.error(err)
    fastify = build(
      {
        hemera: {
          logLevel: 'error'
        },
        plugins: plugins,
        nats: 'nats://127.0.0.1:' + port,
        logger: {
          level: 'error'
        }
      },
      f => {
        fastify = f
        t.end()
      }
    )
  })
})

test('plugin should be registered', t => {
  t.plan(2)
  t.ok(fastify.hemera.plugins.myPlugin)
  t.deepEqual(fastify.hemera.plugins.myPlugin.plugin$.options, {
    a: 1
  })
})
