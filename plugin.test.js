'use strict'

const t = require('tap')
const test = t.test
const ts = require('hemera-testsuite')
const hp = require('hemera-plugin')
const build = require('./example')

let fastify = null
let server = null
const port = 3439

const myPlugin = hp(
  function myPlugin(hemera, options, done) {
    done()
  },
  {
    name: 'myPlugin',
    dependencies: [],
    options: { a: 1 }
  }
)

const plugins = [myPlugin]

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
      plugins,
      nats: 'nats://127.0.0.1:' + port,
      logger: {
        level: 'error'
      }
    })
    // register all plugins
    fastify.ready(() => {
      t.error(err)
      t.end()
    })
  })
})

test('plugin should be registered', t => {
  t.plan(2)
  t.ok(fastify.hemera.plugins.myPlugin)
  t.deepEqual(fastify.hemera.plugins.myPlugin.plugin$.options, {
    a: 1
  })
})
