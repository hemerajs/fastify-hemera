'use strict'

const t = require('tap')
const test = t.test
const ts = require('hemera-testsuite')
const hp = require('hemera-plugin')
const build = require('./example')

const port = 3439

test('Should be able to register a plugin', t => {
  t.plan(3)

  const server = ts.start_server(port, err => {
    t.error(err)
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
    fastify.ready(() => {
      t.error(err)
      fastify.close(() => {
        server.kill()
        t.end()
      })
    })
  })
})

test('Should be able to register a plugin with custom options', t => {
  t.plan(3)

  const server = ts.start_server(port, err => {
    t.error(err)
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
    fastify.ready(() => {
      t.error(err)
      fastify.close(() => {
        server.kill()
        t.end()
      })
    })
  })
})
