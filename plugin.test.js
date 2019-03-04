'use strict'

// eslint-disable-next-line node/no-unpublished-require
const { test } = require('tap')
// eslint-disable-next-line node/no-unpublished-require
const ts = require('hemera-testsuite')
// eslint-disable-next-line node/no-unpublished-require
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
    nats: `nats://127.0.0.1:${port}`
  })

  fastify.ready(readyErr => {
    t.error(readyErr)
    fastify.close(closeError => {
      t.error(closeError)
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
    nats: `nats://127.0.0.1:${port}`
  })

  fastify.ready(readyErr => {
    t.error(readyErr)
    fastify.close(closeError => {
      t.error(closeError)
      t.end()
    })
  })
})

test('teardown', function teardown(t) {
  server.kill()
  t.end()
})
