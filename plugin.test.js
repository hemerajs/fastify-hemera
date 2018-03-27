'use strict'

const t = require('tap')
const test = t.test
const ts = require('hemera-testsuite')
const hp = require('hemera-plugin')
const build = require('./example')

const port = 4250
let server = null

test('setup', t => {
  server = ts.start_server(port, err => {
    t.error(err)
    t.end()
  })
})

test('Should be able to register a plugin', t => {
  t.plan(3)

  const fastify = build({
    plugins: [
      hp(
        function myPlugin(hemera, options, done) {
          t.deepEqual(options, { a: 1 })
          done()
        },
        {
          name: 'myPlugin',
          options: { a: 1 }
        }
      )
    ],
    nats: 'nats://127.0.0.1:' + port
  })

  fastify.ready(err => {
    t.error(err)
    fastify.close(err => {
      t.error(err)
      t.end()
    })
  })
})

test('Should be able to register a plugin with custom options', t => {
  t.plan(3)

  const fastify = build({
    plugins: [
      {
        plugin: hp(
          function myPlugin(hemera, options, done) {
            t.deepEqual(options, { a: 1, b: 2 })
            done()
          },
          {
            name: 'myPlugin',
            options: { a: 1 }
          }
        ),
        options: {
          b: 2
        }
      }
    ],
    nats: 'nats://127.0.0.1:' + port
  })

  fastify.ready(err => {
    t.error(err)
    fastify.close(err => {
      t.error(err)
      t.end()
    })
  })
})

test('teardown', function(t) {
  server.kill()
  t.end()
})
